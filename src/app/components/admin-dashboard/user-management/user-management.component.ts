import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PopupModalService } from './../../../shared/services/popup-modal.service';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { User } from '../../../shared/models/user.class';
import { UserService } from '../../../shared/services/user.service';
import { filter, map, of, Subscription, switchMap, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { Category } from '../../../shared/models/data-tables/category.class';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import { Router } from '@angular/router';
import { UserFilterComponent } from './user-filter/user-filter.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AuthService } from '../../../shared/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { UserDeactivationComponent } from './user-deactivation/user-deactivation.component';

interface UserAndResetPassword extends User {
  resetPassword: boolean;
}

@Component({
  selector: 'app-user-management',
  imports: [
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    NgClass,
    NgIf,
    MatProgressSpinnerModule,
    ServerErrorComponent,
    UserFilterComponent,
    MatButtonModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private isProduction = environment.production;

  displayedColumns: string[] = [
    'image',
    'displayName',
    'username',
    'isAvailable',
    'branch',
    'categories',
    'actions',
  ];

  dataSource: MatTableDataSource<User>;
  workers: User[];
  filteredWorkers: User[];

  @ViewChild(MatTable) table: MatTable<User>;

  isWorkersLoaded = false;
  showUsersServerError = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private popupModalService: PopupModalService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.userService.getWorkers().subscribe({
        next: (response: User[]) => {
          this.workers = response;
          this.filteredWorkers = [...this.workers];
          this.dataSource = new MatTableDataSource(this.workers);
          this.isWorkersLoaded = true;
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          this.showUsersServerError = true;
        },
      }),
    );
  }

  navigateToProfilePage(profileId: number) {
    this.router.navigateByUrl(`/profile/${profileId}`);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getCatagories(catagories?: Category[]): string {
    return catagories?.map((c) => c.displayName).join(', ') || '';
  }

  applyFilters(filters: {
    categoryId?: number | null;
    branchId?: number | null;
    statusId?: number | null;
    searchText?: string | null;
  }) {
    const noFiltersSelected =
      filters.categoryId === null &&
      filters.branchId === null &&
      filters.statusId === null &&
      filters.searchText === null;

    if (noFiltersSelected) {
      this.filteredWorkers = this.workers; // מציג את כל העובדים
    } else {
      this.filteredWorkers = this.workers.filter((worker) => {
        const matchesCategory =
          filters.categoryId === null ||
          (Array.isArray(worker.categories) &&
            worker.categories.some(
              (category) => category.id === filters.categoryId,
            ));

        const matchesBranch =
          filters.branchId === null || worker.branch?.id === filters.branchId;

        const matchesStatus =
          filters.statusId === null || worker.status?.id === filters.statusId;

        const matchesText =
          filters.searchText === null ||
          worker.displayName.includes(filters.searchText) ||
          worker.username.includes(filters.searchText) ||
          worker.branch.name.includes(filters.searchText) ||
          worker.categories.some((category) =>
            category.displayName.includes(filters.searchText),
          );

        return matchesCategory && matchesBranch && matchesStatus && matchesText;
      });
    }

    this.dataSource = new MatTableDataSource(this.filteredWorkers);
  }

  createWorker(): void {
    const workerDialogRef = this.popupModalService.open(
      UserDetailsComponent,
      {},
      { user: this.authService.getCurrentUser() },
    );

    const workerDetailsSub = workerDialogRef
      .afterClosed()
      .subscribe((result: User) => {
        if (result) {
          if (!result.image) delete result.image;

          // Create worker
          this.userService.createUser(result).subscribe({
            next: (result) => {
              // Add to workers table
              this.workers.push(result);
              this.filteredWorkers.push(result);
              this.dataSource.data = [...this.filteredWorkers];
              this.table.renderRows();
            },
            error: (error) => {
              if (!environment.production)
                console.error('Error fetching data:', error);

              this.popupModalService.open(ServerErrorComponent);
            },
          });
        }
      });

    this.subscriptions.push(workerDetailsSub);
  }

  editWorker(workerId: number): void {
    this.userService
      .getPublicUserById(workerId)
      .pipe(
        switchMap((worker: User) => {
          const dialogRef = this.popupModalService.open(
            UserDetailsComponent,
            {},
            {
              user: this.authService.getCurrentUser(),
              worker,
            },
          );

          return dialogRef.afterClosed();
        }),
        filter(
          (
            userWithResetPassword,
          ): userWithResetPassword is UserAndResetPassword =>
            !!userWithResetPassword,
        ),
        tap((userWithResetPassword) => {
          if (!userWithResetPassword.image) {
            delete userWithResetPassword.image;
          }
        }),
        switchMap((userWithResetPassword) => {
          if (userWithResetPassword.resetPassword) {
            return this.userService
              .resetPassword(
                userWithResetPassword.id,
                userWithResetPassword.password,
              )
              .pipe(
                map(() => {
                  delete userWithResetPassword.password;
                  return userWithResetPassword;
                }),
              );
          } else {
            return of(userWithResetPassword);
          }
        }),
        switchMap((updatedUser) => {
          delete updatedUser.password;
          delete updatedUser.resetPassword;
          return this.userService.updateUser(updatedUser.id, updatedUser);
        }),
      )
      .subscribe({
        next: (result: User) => {
          const updateWorkerInList = (list: User[]) => {
            const index = list.findIndex((worker) => worker.id === result.id);
            if (index !== -1) list[index] = result;
          };

          updateWorkerInList(this.workers);
          updateWorkerInList(this.filteredWorkers);

          this.dataSource.data = [...this.filteredWorkers];
          this.table.renderRows();
        },
        error: (error) => {
          if (!environment.production) {
            console.error('Error fetching data:', error);
          }
          this.popupModalService.open(ServerErrorComponent);
        },
      });
  }

  deactivateWorker(workerId: number) {
    const workerDialogRef = this.popupModalService.open(
      UserDeactivationComponent,
      {},
      {
        workerId: workerId,
      },
    );

    const workerDeactivationSub = workerDialogRef
      .afterClosed()
      .subscribe((result: number) => {
        if (result) {
          // Deactivate worker
          this.userService.deactivateUser(result).subscribe({
            next: (result) => {
              // Remove from workers table
              this.workers = this.workers.filter(
                (worker) => worker.id !== result.id,
              );
              this.filteredWorkers = this.filteredWorkers.filter(
                (worker) => worker.id !== result.id,
              );
              this.dataSource.data = [...this.filteredWorkers];
              this.table.renderRows();
            },
            error: (error) => {
              if (!environment.production)
                console.error('Error fetching data:', error);

              this.popupModalService.open(ServerErrorComponent);
            },
          });
        }
      });

    this.subscriptions.push(workerDeactivationSub);
  }
}

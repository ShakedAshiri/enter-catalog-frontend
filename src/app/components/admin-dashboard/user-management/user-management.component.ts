import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PopupModalService } from './../../../shared/services/popup-modal.service';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { User } from '../../../shared/models/user.class';
import { UserService } from '../../../shared/services/user.service';
import { Subscription } from 'rxjs';
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
import { MatDialogRef } from '@angular/material/dialog';

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
              this.dataSource.data.push(result);
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
    this.userService.getPublicUserById(workerId).subscribe({
      next: (response: User) => {
        const workerDialogRef = this.popupModalService.open(
          UserDetailsComponent,
          {},
          {
            user: this.authService.getCurrentUser(),
            worker: response,
          },
        );

        const workerDetailsSub = workerDialogRef
          .afterClosed()
          .subscribe((result: User) => {
            if (result) {
              if (!result.image) delete result.image;

              // Create worker
              this.userService.updateUser(result.id, result).subscribe({
                next: (result) => {
                  // Add to workers table
                  this.workers.push(result);
                  this.dataSource.data.push(result);
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
      },
      error: (error) => {
        if (!this.isProduction) console.error('Error fetching data:', error);
        // this.isError = true;
      },
    });
  }
}

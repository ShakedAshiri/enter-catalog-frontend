import { PopupModalService } from './../../../shared/services/popup-modal.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
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
  @ViewChild(MatTable) table: MatTable<User>;

  dataSource: User[];
  workers: User[];

  isUsersLoaded = false;
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
          this.dataSource = [...this.workers];
          this.isUsersLoaded = true;
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
              this.dataSource.push(result);
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
                  this.dataSource.push(result);
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

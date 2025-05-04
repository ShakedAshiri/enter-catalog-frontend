import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
    'isAvailable',
    'branch',
    'categories',
    'actions',
  ];
  dataSource: MatTableDataSource<User>;
  users: User[];
  filteredUsers: User[];

  isUsersLoaded = false;
  showUsersServerError = false;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.userService.getWorkers().subscribe({
        next: (response: User[]) => {
          this.users = response;
          this.filteredUsers = [...this.users];
          this.dataSource = new MatTableDataSource(this.filteredUsers);
          this.isUsersLoaded = true;
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          this.showUsersServerError = true;
        },
      }),
    );
  }

  ngOnChange(changes: SimpleChanges) {
    if (changes['filteredUsers']) {
      this.dataSource = new MatTableDataSource(this.filteredUsers);
    }
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
    category?: string;
    branch?: string;
    status?: string;
  }) {
    this.filteredUsers = this.users.filter(
      (user) =>
        (!filters.category ||
          user.categories.some(
            (category) => category.name === filters.category,
          )) &&
        (!filters.branch || user.branch.name === filters.branch) &&
        (!filters.status || user.status.name === filters.status),
    );
  }
}

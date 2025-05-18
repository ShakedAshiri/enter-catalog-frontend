import { User } from './../../shared/models/user.class';
import { Component, OnInit } from '@angular/core';
import { TopRectangleComponent } from './rectangle/top-rectangle.component';
import { UsersGridComponent } from './users-grid/users-grid.component';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { Category } from '../../shared/models/data-tables/category.class';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { UserService } from '../../shared/services/user.service';
import { DataTableService } from '../../shared/services/data-table.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServerErrorComponent } from '../../shared/components/server-error/server-error.component';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { ContactUsComponent } from '../../shared/components/contact-us/contact-us.component';

@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    UsersGridComponent,
    AboutComponent,
    CategoryFilterComponent,
    ContactUsComponent,
    MatProgressSpinnerModule,
    ServerErrorComponent,
    TopRectangleComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  private users: User[] = [];
  visibleUsers: User[] = [];
  private filteredUsers: User[] = [];
  private searchText: string = '';
  private searchCategories: Set<Category>;
  itemsPerPageCount: number = 6;
  itemsPerPage: number;
  categories: Category[] = [];

  showCategoriesServerError = false;
  showUsersServerError = false;

  isProduction = environment.production;

  get hasMoreItems(): boolean {
    return this.visibleUsers.length < this.filteredUsers.length;
  }

  get isUsersLoaded(): boolean {
    return this.users.length > 0;
  }

  constructor(
    public userService: UserService,
    public dataTableService: DataTableService,
  ) {}

  ngOnInit() {
    this.loadInitialItems();
  }

  loadInitialItems() {
    this.subscriptions.push(
      this.userService.getWorkers().subscribe({
        next: (response: User[]) => {
          this.users = response;

          this.visibleUsers = this.users.slice(0, this.itemsPerPage);
          this.filteredUsers = this.users;
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          this.showUsersServerError = true;
        },
      }),
    );

    this.subscriptions.push(
      this.dataTableService.getCategories().subscribe({
        next: (response: Category[]) => {
          this.categories = response;
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          this.showCategoriesServerError = true;
        },
      }),
    );

    this.itemsPerPage = this.itemsPerPageCount;
  }

  loadMore() {
    this.itemsPerPage += this.itemsPerPageCount;

    const nextItems = this.filteredUsers.slice(
      this.visibleUsers.length,
      this.visibleUsers.length + this.itemsPerPageCount,
    );
    this.visibleUsers = [...this.visibleUsers, ...nextItems];
  }

  private updateVisibleUsers() {
    this.visibleUsers = this.filteredUsers.slice(0, this.itemsPerPage);
  }

  filterUsersByCategory(categoryFilter: Set<Category>) {
    this.searchCategories = categoryFilter;

    // Step 1: Filter by text
    let usersAfterTextFilter = this.searchUsersByText(this.users);

    // Step 2: Filter by category only if categoryFilter is not empty
    this.filteredUsers =
      categoryFilter.size > 0
        ? this.searchUsersByCategory(usersAfterTextFilter)
        : usersAfterTextFilter;

    // Step 3: Apply pagination separately
    this.updateVisibleUsers();
  }

  private searchUsersByCategory(usersToSearch: User[]): User[] {
    if (!this.searchCategories || this.searchCategories.size === 0) {
      return usersToSearch;
    }

    const selectedCategories = Array.from(this.searchCategories);

    return usersToSearch.filter((user) =>
      user.categories.some((userCategory) =>
        selectedCategories.some((category) => category.id === userCategory.id),
      ),
    );
  }

  filterUsersByText(textFilter: string) {
    this.searchText = textFilter;

    // Step 1: Filter by category
    let usersAfterCategoryFilter = this.searchUsersByCategory(this.users);

    // Step 2: Filter by text only if textFilter is not empty
    this.filteredUsers =
      textFilter.length > 0
        ? this.searchUsersByText(usersAfterCategoryFilter)
        : usersAfterCategoryFilter;

    // Step 3: Apply pagination separately
    this.updateVisibleUsers();
  }

  private searchUsersByText(usersToSearch: User[]): User[] {
    return this.searchText.length === 0
      ? usersToSearch
      : usersToSearch.filter(
          (user) =>
            user.displayName.includes(this.searchText) ||
            user.description.includes(this.searchText),
        );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

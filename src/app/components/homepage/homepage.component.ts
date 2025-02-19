import { User } from './../../shared/models/user.class';
import { Component, OnInit } from '@angular/core';
import { BannerComponent } from './banner/banner.component';
import { UsersGridComponent } from './users-grid/users-grid.component';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { Category } from '../../shared/models/data-tables/category.class';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { UserService } from '../../shared/services/user.service';
import { DataTableService } from '../../shared/services/data-table.service';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServerErrorComponent } from '../../shared/components/server-error/server-error.component';

@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    BannerComponent,
    UsersGridComponent,
    AboutComponent,
    CategoryFilterComponent,
    ContactUsComponent,
    MatProgressSpinnerModule,
    ServerErrorComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  private users: User[] = [];
  visibleUsers: User[] = [];
  private filteredUsers: User[] = [];
  private searchText: string = '';
  private searchCategories: Set<Category>;
  itemsPerPageCount: number = 6;
  itemsPerPage: number;
  categories: Category[] = [];

  usersServerError = false;
  categoriesServerError = false;

  get hasMoreItems(): boolean {
    return this.visibleUsers.length < this.filteredUsers.length;
  }

  get isUsersLoaded(): boolean {
    return this.users.length > 0;
  }

  constructor(
    public userService: UserService,
    public dataTableService: DataTableService
  ) {}

  ngOnInit() {
    this.loadInitialItems();
  }

  loadInitialItems() {
    this.userService.getWorkers().subscribe({
      next: (response: User[]) => {
        //Suffle users
        // TODO: move to backend?
        for (let i = response.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [response[i], response[j]] = [response[j], response[i]];
        }

        this.users = response;

        this.visibleUsers = this.users.slice(0, this.itemsPerPage);
        this.filteredUsers = this.users;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.usersServerError = true;
      },
    });

    this.dataTableService.getCategories().subscribe({
      next: (response: Category[]) => {
        this.categories = response;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.categoriesServerError = true;
      },
    });

    this.itemsPerPage = this.itemsPerPageCount;
  }

  loadMore() {
    this.itemsPerPage += this.itemsPerPageCount;

    const nextItems = this.filteredUsers.slice(
      this.visibleUsers.length,
      this.visibleUsers.length + this.itemsPerPageCount
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
        selectedCategories.some((category) => category.id === userCategory.id)
      )
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
            user.description.includes(this.searchText)
        );
  }
}

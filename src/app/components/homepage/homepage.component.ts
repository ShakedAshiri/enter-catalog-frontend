import { User } from './../../shared/models/user.class';
import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../../banner/banner.component';
import { UsersGridComponent } from './users-grid/users-grid.component';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { Category } from '../../shared/models/data-tables/category.class';
import { CategoryFilterComponent } from "./category-filter/category-filter.component";
import { UserService } from '../../shared/services/user.service';
import { DataTableService } from '../../shared/services/data-table.service';

@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    BannerComponent,
    UsersGridComponent,
    AboutComponent,
    CategoryFilterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  private users: User[] = []
  visibleUsers : User[] = [];
  filteredUsers : User[] = [];
  itemsPerPageCount : number = 6;
  itemsPerPage : number;
  categories : Category[] = [];

  get hasMoreItems(): boolean {
    return this.visibleUsers.length < this.filteredUsers.length;
  }

  constructor(public userService: UserService,
              public dataTableService: DataTableService) {}

  ngOnInit() {
    this.loadInitialItems();
  }

  loadInitialItems() {
    this.users = this.userService.getUsers();
    this.categories = this.dataTableService.getCategories();
    this.itemsPerPage = this.itemsPerPageCount;
    this.visibleUsers = this.users.slice(0, this.itemsPerPage);
    this.filteredUsers = this.users;
  }

  loadMore() {
    this.itemsPerPage += this.itemsPerPageCount;

    const nextItems = this.filteredUsers.slice(
      this.visibleUsers.length,
      this.visibleUsers.length + this.itemsPerPageCount
    );
    this.visibleUsers = [...this.visibleUsers, ...nextItems];
  }

  filterUsers(categoryFilter: Set<Category>) {
    this.filteredUsers = categoryFilter.size === 0
                          ? this.users
                          : this.users.filter(user =>
                              Array.from(categoryFilter).some(
                              category => user.categories.includes(category)
                            )
                          );


    this.visibleUsers = this.filteredUsers.slice(0, this.itemsPerPage);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { DataTableService } from '../../../../shared/services/data-table.service';
import { Subscription } from 'rxjs';
import { Category } from '../../../../shared/models/data-tables/category.class';
import { environment } from '../../../../../environments/environment';
import { JsonPipe, NgFor } from '@angular/common';
import { Branch } from '../../../../shared/models/data-tables/branch.class';

@Component({
  selector: 'app-user-filter',
  imports: [
    MatFormField,
    MatInputModule,
    MatIconModule,
    MatSelect,
    MatOption,
    FormsModule,
    NgFor,
  ],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
})
export class UserFilterComponent {
  private subscriptions: Subscription[] = [];

  @Output() textFilterChange = new EventEmitter<string>();
  @Output() filtersChanged = new EventEmitter<{
    categoryId?: number | null;
    branchId?: number | null;
    statusId?: number | null;
    searchText?: string | null;
  }>();

  isProduction = environment.production;

  constructor(private readonly dataTableService: DataTableService) {}

  categories = [];
  showCategoriesServerError = false;
  selectedCategoryId = '';

  branches = [];
  selectedBranchId = '';

  statuses = [];
  selectedStatusId = '';

  searchText: string;
  clearText() {
    this.searchText = '';
  }

  emitFilters() {
    console.log(this.searchText);
    this.filtersChanged.emit({
      categoryId:
        !this.selectedCategoryId === true
          ? null
          : Number(this.selectedCategoryId),
      branchId:
        !this.selectedBranchId === true ? null : Number(this.selectedBranchId),
      statusId:
        !this.selectedStatusId === true ? null : Number(this.selectedStatusId),
      searchText: !this.searchText === true ? null : this.searchText,
    });
  }

  ngOnInit() {
    this.loadInitialItems();
  }

  loadInitialItems() {
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

    this.subscriptions.push(
      this.dataTableService.getBranches().subscribe({
        next: (response: Branch[]) => {
          this.branches = response;
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          this.showCategoriesServerError = true;
        },
      }),
    );

    // TODO: fetch from backend
    this.statuses = [
      { id: 1, name: 'active', displayName: 'פעיל' },
      { id: 2, name: 'inactive', displayName: 'לא פעיל' },
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

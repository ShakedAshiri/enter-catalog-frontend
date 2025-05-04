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

@Component({
  selector: 'app-user-filter',
  imports: [
    MatFormField,
    MatInputModule,
    MatIconModule,
    MatSelect,
    MatOption,
    FormsModule,
  ],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
})
export class UserFilterComponent {
  @Output() textFilterChange = new EventEmitter<string>();
  @Output() filtersChanged = new EventEmitter<{
    category?: string;
    branch?: string;
    status?: string;
  }>();

  categories = [];
  selectedCategory = '';

  branches = [];
  selectedBranch = '';

  statuses = [];
  selectedStatus = '';

  searchText: string;
  searchTextFilter() {}

  clearText() {}

  emitFilters() {
    this.filtersChanged.emit({
      category: this.selectedCategory,
      branch: this.selectedBranch,
      status: this.selectedStatus,
    });
  }
}

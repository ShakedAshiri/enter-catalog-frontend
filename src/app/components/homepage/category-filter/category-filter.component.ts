import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../shared/models/data-tables/category.class';
import { CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ClearButtonComponent } from './clear-button/clear-button.component';

@Component({
  selector: 'app-category-filter',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    ClearButtonComponent,
  ],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent {
  @Input() categories: Category[];
  @Output() categoryFilterChange = new EventEmitter<Set<Category>>();
  @Output() textFilterChange = new EventEmitter<string>();
  selectedCategories = new Set<Category>();
  searchText: string;
  showMore = false;

  toggleCategory(category: Category) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }

    this.categoryFilterChange.emit(this.selectedCategories);
  }

  resetFilter() {
    this.selectedCategories.clear();
    this.categoryFilterChange.emit(this.selectedCategories);
  }

  searchTextFilter() {
    this.textFilterChange.emit(this.searchText);
  }

  clearText() {
    this.searchText = '';
    this.textFilterChange.emit(this.searchText);
  }
}

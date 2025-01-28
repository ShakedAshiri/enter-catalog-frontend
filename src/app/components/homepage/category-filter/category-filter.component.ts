import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../shared/models/data-tables/category.class';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-filter',
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss'
})
export class CategoryFilterComponent {
  @Input() categories: Category[];
  @Output() filterChange = new EventEmitter<Set<Category>>();
  selectedCategories = new Set<Category>();
  search : string;

  toggleCategory(category: Category) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }

    this.filterChange.emit(this.selectedCategories);
  }

  resetFilter() {
    this.selectedCategories.clear();
    this.filterChange.emit(this.selectedCategories);
  }
}

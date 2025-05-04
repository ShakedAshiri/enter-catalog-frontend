import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-filter',
  imports: [MatFormField, MatInputModule, MatIconModule, FormsModule],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
})
export class UserFilterComponent {
  @Output() textFilterChange = new EventEmitter<string>();

  searchText: string;
  searchTextFilter() {}

  clearText() {}
}

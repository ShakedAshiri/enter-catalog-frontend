import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../../shared/models/user.class';
import { Category } from '../../../../shared/models/data-tables/category.class';

@Component({
  selector: 'app-user-card',
  imports: [MatCardModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() user: User;

  getCategoryClass(category: Category): string {
    return `user-card--${category.name || 'default'}`;
  }
}

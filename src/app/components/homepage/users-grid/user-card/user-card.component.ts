import { ImageService } from './../../../../shared/services/image.service';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../../shared/models/user.class';
import { Category } from '../../../../shared/models/data-tables/category.class';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [MatCardModule, RouterModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  @Input() user: User;

  defaultAvatar: string;

  constructor(private imageService: ImageService) {
    this.defaultAvatar = this.imageService.defaultAvatar;
  }

  getCategoryClass(category: Category): string {
    return `user-card--${category.name || 'default'}`;
  }

  getCategoryClassBadge(category: Category): string {
    return `category-badge--${category.name || 'default'}`;
  }

  getCategoryImagePath(category: Category): string {
    return 'categories/' + category.name + '.svg';
  }
}

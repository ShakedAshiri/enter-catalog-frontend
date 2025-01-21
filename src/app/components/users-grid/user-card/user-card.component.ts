import { Component, Input } from '@angular/core';
import { User } from '../../../shared/models/user.class';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-card',
  imports: [MatCardModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() user: User;
}

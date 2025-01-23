import { Component, Input } from '@angular/core';
import { UserCardComponent } from "./user-card/user-card.component";
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { User } from '../../../shared/models/user.class';

@Component({
  selector: 'app-users-grid',
  imports: [CommonModule, UserCardComponent, MatGridListModule],
  templateUrl: './users-grid.component.html',
  styleUrl: './users-grid.component.scss'
})
export class UsersGridComponent {
  @Input() users: User[] = [];
}

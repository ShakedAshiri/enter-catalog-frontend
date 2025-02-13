import { Component, Input } from '@angular/core';
import { User } from '../../../shared/models/user.class';

@Component({
  selector: 'app-user-info',
  imports: [],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent {
  @Input({ required: true }) user!: User;
}

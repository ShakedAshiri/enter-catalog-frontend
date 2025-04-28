import { Component, Input, OnInit } from '@angular/core';
import { UserCardComponent } from './user-card/user-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { User } from '../../../shared/models/user.class';

@Component({
  selector: 'app-users-grid',
  imports: [CommonModule, UserCardComponent, MatGridListModule],
  templateUrl: './users-grid.component.html',
  styleUrl: './users-grid.component.scss',
})
export class UsersGridComponent implements OnInit {
  @Input() users: User[] = [];
  breakpoint: number = 3;
  rowHeight: string = '1:0.8';

  ngOnInit(): void {
    // Set user card sizes according to window size
    if (window.innerWidth <= 900) {
      this.breakpoint = 2;
      this.rowHeight = '1:1';
    } else if (window.innerWidth > 900 && window.innerWidth <= 1100) {
      this.breakpoint = 3;
      this.rowHeight = '1:1.1';
    } else if (window.innerWidth > 1100 && window.innerWidth <= 1300) {
      this.breakpoint = 3;
      this.rowHeight = '1:0.9';
    } else if (window.innerWidth > 1300 && window.innerWidth <= 1500) {
      this.breakpoint = 3;
      this.rowHeight = '1:0.9';
    } else if (window.innerWidth > 1500 && window.innerWidth <= 1700) {
      this.breakpoint = 3;
      this.rowHeight = '1:0.8';
    } else {
      this.breakpoint = 4;
      this.rowHeight = '1:0.8';
    }
  }
}

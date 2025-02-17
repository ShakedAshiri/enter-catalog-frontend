import { Component, Input, OnInit } from '@angular/core';
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
export class UsersGridComponent implements OnInit {
  @Input() users: User[] = [];
  breakpoint: number = 3;
  rowHeight: string = "1:0.8";

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 400) ? 2 : 3;
    this.rowHeight = (window.innerWidth <= 400) ? "1:1" : "1:0.8";
  }
}

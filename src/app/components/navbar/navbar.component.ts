import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PopupModalService } from '../../shared/services/popup-modal.service';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.class';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule,
            MatButtonModule,
            MatIconModule,
            CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  user$: Observable<User | null>;

  constructor(private popupModalService: PopupModalService,
              public authService: AuthService) {
    this.user$ = this.authService.currentUser$;
  }

  openLoginForm(): void {
    const loginDialogRef = this.popupModalService.open(LoginComponent);

    loginDialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO: Display Error? if needed
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}

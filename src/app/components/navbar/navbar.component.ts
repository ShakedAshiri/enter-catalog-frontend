import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PopupModalService } from '../../shared/services/popup-modal.service';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.class';
import { Observable, Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { PasswordResetComponent } from '../auth/password-reset/password-reset.component';
import { ImageService } from '../../shared/services/image.service';
import { ClientLoginComponent } from '../auth/client-login/client-login.component';
import { ClientSignupComponent } from '../auth/client-signup/client-signup.component';
import { SuccessModalComponent } from '../../shared/components/success-modal/success-modal.component';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-navbar',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatProgressSpinner,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private subscriptions: Subscription[] = [];

  user$: Observable<User | null>;

  defaultAvatar: string;

  isLoggingOut: boolean = false;

  constructor(
    private popupModalService: PopupModalService,
    public authService: AuthService,
    private imageService: ImageService,
  ) {
    this.user$ = this.authService.currentUser$;
    this.defaultAvatar = this.imageService.defaultAvatar;
  }

  openLoginForm(): void {
    const loginDialogRef = this.popupModalService.open(LoginComponent);

    const loginSub = loginDialogRef.afterClosed().subscribe((result: User) => {
      if (result && result.isPasswordReset) {
        // Reset password
        const resetDialogRef = this.popupModalService.open(
          PasswordResetComponent,
          { disableClose: true },
        );

        const resetSub = resetDialogRef.afterClosed().subscribe(() => {});

        this.subscriptions.push(resetSub);
      }
    });

    this.subscriptions.push(loginSub);
  }

  openClientLoginForm(): void {
    const loginDialogRef = this.popupModalService.open(ClientLoginComponent, {
      width: '400px',
    });

    const loginSub = loginDialogRef.afterClosed().subscribe((result: any) => {
      if (result && result === 'signup') {
        // Open signup window
        const signupDialogRef = this.popupModalService.open(
          ClientSignupComponent,
          { width: '400px' },
        );

        const signupSub = signupDialogRef
          .afterClosed()
          .subscribe((result: User) => {
            if (result) {
              // Display success message
              this.popupModalService.open(
                SuccessModalComponent,
                {},
                { text: 'נרשמת בהצלחה!' },
              );
            }
          });

        this.subscriptions.push(signupSub);
      }
    });

    this.subscriptions.push(loginSub);
  }

  logout(): void {
    this.isLoggingOut = true;

    this.authService.logout().subscribe({
      next: () => {
        window.location.reload();
      },
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.class';
import { AuthService } from '../../shared/services/auth.service';
import { Role } from '../../shared/constants/role';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserWorksComponent } from './user-works/user-works.component';
import { NgIf } from '@angular/common';
import { ServerErrorComponent } from '../../shared/components/server-error/server-error.component';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContactUsProfilePageComponent } from './contact-us-profile-page/contact-us-profile-page.component';

@Component({
  selector: 'app-profile-page',
  imports: [
    UserInfoComponent,
    UserWorksComponent,
    NgIf,
    ServerErrorComponent,
    MatProgressSpinnerModule,
    ContactUsProfilePageComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  private subscriptions: Subscription[] = [];
  profileUser: User;
  isEditable: boolean = false;

  showUserProfileServerError = false;

  isProduction = environment.production;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
  ) {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // If worker (for a different worker) or logged out user

      let sub: Subscription;

      if (
        !this.authService.isLoggedIn() ||
        this.authService.getCurrentUser().userRole.id === Role.WORKER ||
        this.authService.getCurrentUser().userRole.id === Role.CLIENT
      ) {
        sub = this.userService
          .getPublicUserById(+id)
          .subscribe(this.getUserProfile());
      }
      // If current user in their own profile
      else if (
        this.authService.isLoggedIn() &&
        this.authService.getCurrentUser().id === +id
      ) {
        sub = this.userService
          .getUserProfile()
          .subscribe(this.getUserProfile());
      }
      // If admin or team-lead from the same branch
      else if (this.authService.isActionPermitted(+id)) {
        sub = this.userService
          .getSecureUserById(+id)
          .subscribe(this.getUserProfile());
      } else {
        if (!this.isProduction) console.error('error in getUserProfile');
        this.showUserProfileServerError = true;
      }

      if (sub) {
        this.subscriptions.push(sub);
      }
    }
  }

  getUserProfile() {
    return {
      next: (response: User) => {
        this.profileUser = response;
        this.authService
          .isActionPermitted(response.id)
          .subscribe((isAllowed) => {
            this.isEditable = isAllowed;
          });
      },
      error: (error) => {
        if (!this.isProduction) console.error('Error fetching data:', error);
        this.showUserProfileServerError = true;
      },
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get loggedInUserIsClient() {
    return this.authService.getCurrentUser()?.userRole.id === Role.CLIENT;
  }
}

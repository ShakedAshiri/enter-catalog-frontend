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

@Component({
  selector: 'app-profile-page',
  imports: [UserInfoComponent, UserWorksComponent, NgIf, ServerErrorComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileUser: User;
  isEditable: boolean = false;

  showUserProfileServerError = false;

  isProduction = environment.production;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService
  ) {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // If worker (for a different worker) or logged out user
      if (
        !this.authService.isLoggedIn() ||
        this.authService.getCurrentUser().userRole.id === Role.WORKER
      ) {
        this.userService
          .getPublicUserById(+id)
          .subscribe(this.getUserProfile());
      }
      // If current user in their own profile
      else if (
        this.authService.isLoggedIn() &&
        this.authService.getCurrentUser().id === +id
      ) {
        this.userService.getUserProfile().subscribe(this.getUserProfile());
      }
      // If admin or team-lead from the same branch
      else if (this.authService.isActionPermitted(+id)) {
        this.userService
          .getSecureUserById(+id)
          .subscribe(this.getUserProfile());
      } else {
        if (!this.isProduction) console.error('error in getUserProfile');
        this.showUserProfileServerError = true;
      }
    }
  }

  getUserProfile() {
    return {
      next: (response: User) => {
        this.profileUser = response;
        let a = this.authService.isActionPermitted(response.id);
        this.isEditable = false;
      },
      error: (error) => {
        if (!this.isProduction) console.error('Error fetching data:', error);
        this.showUserProfileServerError = true;
      },
    };
  }
}

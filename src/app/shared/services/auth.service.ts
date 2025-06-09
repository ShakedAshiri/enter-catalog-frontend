import { UserService } from './user.service';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../models/user.class';
import { ApiConstants } from '../constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { Role } from '../constants/role';
import { LocalStorageKeys } from '../constants/localStorage.constants';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageKey = LocalStorageKeys.USER_INFO;
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getCurrentUser(),
  );
  public currentUser$ = this.getUserAsObservable();
  isProduction = environment.production;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private ngZone: NgZone,
  ) {
    // This listens to changes accross tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.localStorageKey) {
        this.ngZone.run(() => {
          this.currentUserSubject.next(JSON.parse(event.newValue));
        });
      }
    });
  }

  login(username: string, password: string): Observable<User> {
    const response = this.http
      .post<User>(ApiConstants.ENDPOINTS.AUTH.LOGIN, { username, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.localStorageKey, JSON.stringify(response));
          this.currentUserSubject.next(response); // This updates in the same tab
        }),
      );

    return response;
  }

  clientLogin(user: Partial<User>): Observable<User> {
    const response = this.http
      .post<User>(ApiConstants.ENDPOINTS.AUTH.CLIENT_LOGIN, { user })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.localStorageKey, JSON.stringify(response));
          this.currentUserSubject.next(response);
        }),
      );

    return response;
  }

  logout() {
    // Add Google sign-out if user was authenticated via Google
    if (this.getCurrentUser()?.authProvider == 'GOOGLE' && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }

    localStorage.removeItem(this.localStorageKey);

    return this.http.post(ApiConstants.ENDPOINTS.AUTH.LOGOUT, {});
  }

  resetPassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<User> {
    return this.http.patch<User>(ApiConstants.ENDPOINTS.AUTH.RESET_PASSWORD, {
      password: newPassword,
    });
  }

  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem(this.localStorageKey));
  }

  getUserAsObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return Boolean(localStorage.getItem(this.localStorageKey));
  }

  /**
   * Check if current user or ADMIN or TEAMLEAD from the same branch
   * @param forUserId user to perform action on
   * @returns is permitted
   */
  isActionPermitted(forUserId: number): Observable<boolean> {
    // Action permitted for current user
    // -OR-
    // ADMIN
    // -OR-
    // for TEAMLEAD if:
    // teamlead is from the same branch as the user we want to perform action on
    return this.currentUserSubject.pipe(
      switchMap((currentUser) => {
        if (!currentUser) return of(false);

        if (
          currentUser.id === forUserId ||
          currentUser.userRole.id === Role.ADMIN
        ) {
          return of(true);
        }

        if (currentUser.userRole.id === Role.TEAMLEAD) {
          let isFromBranch = this.userService.isUserFromBranch(
            forUserId,
            currentUser.branch?.id,
          );
          return of(isFromBranch);
        }

        return of(false);
      }),
    );
  }

  initializeGoogleAuth(): void {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: environment.GOOGLE_CLIENT_ID,
        callback: (response: any) =>
          this.handleGoogleAuthResponse(response).subscribe({
            next: () => {
              window.location.reload();
            },
            error: (err) => {
              if (!this.isProduction) {
                console.error('Google login failed:', err);
              }
            },
          }),
      });
    }
  }

  private handleGoogleAuthResponse(responseFromGoogle: any): Observable<User> {
    const idToken = responseFromGoogle.credential;

    const response = this.http
      .post<User>(ApiConstants.ENDPOINTS.AUTH.GOOGLE_LOGIN, { idToken })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.localStorageKey, JSON.stringify(response));
          this.currentUserSubject.next(response); // This updates in the same tab
        }),
      );

    return response;
  }

  promptGoogleSignIn(): void {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  }

  renderGoogleButton(elementId: string): void {
    if (window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'filled_blue',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          locale: 'he',
          width: '338',
        },
      );
    }
  }
}

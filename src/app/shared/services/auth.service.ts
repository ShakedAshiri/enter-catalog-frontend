import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '../models/user.class';
import { ApiConstants } from '../constants/api.constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Role } from '../constants/role';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private accessToken: string | null = null;

  constructor(private http: HttpClient, private userService: UserService) {
    this.restoreSession();
  }

  private async restoreSession() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        // Using firstValueFrom instead of toPromise()
        await firstValueFrom(this.refreshUserSession());
      } catch {
        // If refresh fails, clear any stored data
        this.clearSession();
      }
    }
  }

  private setSession(response: User) {
    // Store refresh token only in localStorage
    //localStorage.setItem('refreshToken', response.refreshToken);
    // TODO

    // Keep access token in memory only
    this.accessToken = response.token;

    // Keep user data in memory only
    this.currentUserSubject.next(response);
  }

  private clearSession() {
    localStorage.removeItem('refreshToken');
    this.accessToken = null;
    this.currentUserSubject.next(null);
  }

  refreshUserSession(): Observable<User> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return of(null);
    }

    return this.http
      .post<User>(ApiConstants.ENDPOINTS.AUTH.REFRESH, { refreshToken })
      .pipe(
        tap((response) => this.setSession(response)),
        catchError((error) => {
          this.clearSession();
          throw error;
        })
      );
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        ApiConstants.ENDPOINTS.AUTH.LOGIN,
        { username, password },
        { withCredentials: true }
      )
      .pipe(tap((response) => this.setSession(response)));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    this.currentUserSubject.next(null);

    this.http.post(
      ApiConstants.ENDPOINTS.AUTH.LOGOUT,
      {},
      { withCredentials: true }
    );
  }

  resetPassword(
    currentPassword: string,
    newPassword: string
  ): Observable<User> {
    return this.http.patch<User>(ApiConstants.ENDPOINTS.AUTH.RESET_PASSWORD, {
      password: newPassword,
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value && !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
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
      switchMap(currentUser => {
        if (!currentUser) return of(false);

        if (currentUser.id === forUserId || currentUser.userRole.id === Role.ADMIN) {
          return of(true);
        }

        if (currentUser.userRole.id === Role.TEAMLEAD) {
          let isFromBranch = this.userService.isUserFromBranch(forUserId, currentUser.branch?.id);
          return of(isFromBranch);
        }

        return of(false);
      })
    );

  }
}

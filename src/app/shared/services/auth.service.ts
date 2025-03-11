import { UserService } from './user.service';
import { Injectable, NgZone } from '@angular/core';
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
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localStorageKey = 'user_info';
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getCurrentUser()
  );
  public currentUser$ = this.getUserAsObservable();

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private ngZone: NgZone,
    private router: Router
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
        })
      );

    return response;
  }

  logout() {
    localStorage.removeItem(this.localStorageKey);
    return this.http.post(ApiConstants.ENDPOINTS.AUTH.LOGOUT, {});
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
            currentUser.branch?.id
          );
          return of(isFromBranch);
        }

        return of(false);
      })
    );
  }
}

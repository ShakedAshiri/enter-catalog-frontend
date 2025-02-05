import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, of, tap } from 'rxjs';
import { User } from '../models/user.class';
import { ApiConstants } from '../constants/api.constants';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private accessToken: string | null = null;


  constructor(private http: HttpClient) {
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

    return this.http.post<User>(ApiConstants.ENDPOINTS.AUTH.REFRESH, { refreshToken })
      .pipe(
        tap(response => this.setSession(response)),
        catchError(error => {
          this.clearSession();
          throw error;
        })
      );
  }

  login(username: string, password: string):  Observable<User> {
    return this.http.post<User>(ApiConstants.ENDPOINTS.AUTH.LOGIN, {username, password})
      .pipe(
        tap(response => this.setSession(response))
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    this.currentUserSubject.next(null);

    this.http.post(ApiConstants.ENDPOINTS.AUTH.LOGOUT, {});
  }

  resetPassword(currentPassword: string, newPassword: string): Observable<User> {
    return this.http.post<User>(
      ApiConstants.ENDPOINTS.AUTH.RESET_PASSWORD,
      {
        currentPassword,
        newPassword
      }
    );
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
}

import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiConstants } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private workers: User[];

  constructor(private http: HttpClient) {}

  private setWorkers(workers: User[]) {
    this.workers = workers;
  }

  public isUserFromBranch(id: number, branchId: number): boolean | null {
    return (
      this.workers?.some(
        (worker) => worker.id === id && worker.branch.id === branchId,
      ) ?? null
    );
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(ApiConstants.ENDPOINTS.USERS.ALL_USERS);
  }

  public getWorkers(): Observable<User[]> {
    return this.http
      .get<User[]>(ApiConstants.ENDPOINTS.USERS.WORKERS)
      .pipe(tap((response) => this.setWorkers(response)));
  }

  public getPublicUserById(id: number): Observable<User> {
    const url = ApiConstants.buildUrl(
      ApiConstants.ENDPOINTS.USERS.PUBLIC_USER,
      { id: id },
    );
    return this.http.get<User>(url);
  }

  public getSecureUserById(id: number): Observable<User> {
    const url = ApiConstants.buildUrl(
      ApiConstants.ENDPOINTS.USERS.SECURE_USER,
      { id: id },
    );
    return this.http.get<User>(url);
  }

  public getUserProfile() {
    return this.http.get<User>(ApiConstants.ENDPOINTS.USERS.PROFILE);
  }

  public updateUser(id: number, userData: Partial<User>): Observable<User> {
    const url = ApiConstants.buildUrl(ApiConstants.ENDPOINTS.USERS.UPDATE, {
      id: id,
    });

    delete userData.id;

    return this.http.patch<User>(url, userData);
  }

  public resetPassword(id: number, password: string): Observable<User> {
    const url = ApiConstants.buildUrl(
      ApiConstants.ENDPOINTS.USERS.RESET_PASSWORD,
      {
        id: id,
      },
    );

    return this.http.patch<User>(url, { password });
  }

  public createUser(newUser: Partial<User>): Observable<User> {
    return this.http.post<User>(ApiConstants.ENDPOINTS.USERS.CREATE, newUser);
  }

  public deactivateUser(id: number): Observable<User> {
    const url = ApiConstants.buildUrl(ApiConstants.ENDPOINTS.USERS.DEACTIVATE, {
      id: id,
    });

    return this.http.patch<User>(url, {});
  }
}

import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  public getUsers():  Observable<User[]>  {
    return this.http.get<User[]>(ApiConstants.ENDPOINTS.USERS.ALL_USERS);
  }

  public getWorkers():  Observable<User[]>  {
    return this.http.get<User[]>(ApiConstants.ENDPOINTS.USERS.WORKERS);
  }
}

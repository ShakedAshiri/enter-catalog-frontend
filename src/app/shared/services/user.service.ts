import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://enter-catalog-backend-uw98.onrender.com/';

  constructor(private http: HttpClient) {}

  public getUsers():  Observable<User[]>  {
    return this.http.get<User[]>(this.apiUrl + "user");
  }
}

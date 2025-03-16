import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserWork } from '../models/userWork.class';
import { ApiConstants } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class UserWorksService {

  constructor(private http: HttpClient) {}

  public createUserWork(userWork: UserWork) {
    return this.http.post<UserWork>(
      ApiConstants.ENDPOINTS.WORKS.CREATE,
      userWork,
    );
  }
}

import { Injectable } from '@angular/core';
import { Category } from '../models/data-tables/category.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {

  constructor(private http: HttpClient) {}

  public getCategories():  Observable<Category[]>  {
    return this.http.get<Category[]>(ApiConstants.ENDPOINTS.DATA_TABLES.CATEGORIES);
  }
}

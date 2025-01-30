import { Injectable } from '@angular/core';
import { Category } from '../models/data-tables/category.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {
  private apiUrl = 'https://enter-catalog-backend-uw98.onrender.com/data-table/';

  constructor(private http: HttpClient) {}

  public getCategories():  Observable<Category[]>  {
    return this.http.get<Category[]>(this.apiUrl + "categories");
  }
}

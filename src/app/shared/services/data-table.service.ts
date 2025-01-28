import { Injectable } from '@angular/core';
import { Category } from '../models/data-tables/category.class';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {

  constructor() { }

  getCategories() {
    return [
      new Category("1", "animator", "אנימציה"),
      new Category("1", "uiux", "UI\\UX"),
      new Category("1", "developer", "פיתוח תוכנה")
    ]
  }
}

import { Injectable } from '@angular/core';
import { Category } from '../models/data-tables/category.class';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstants } from '../constants/api.constants';
import { ApplyReason } from '../models/data-tables/applyReason.class';
import { Branch } from '../models/data-tables/branch.class';
import { Role } from '../constants/role';
import { UserRole } from '../models/data-tables/userRole.class';
import { Status } from '../models/data-tables/status.class';

@Injectable({
  providedIn: 'root',
})
export class DataTableService {
  constructor(private http: HttpClient) {}

  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      ApiConstants.ENDPOINTS.DATA_TABLES.CATEGORIES,
    );
  }

  public getApplyReasons(): Observable<ApplyReason[]> {
    return this.http.get<ApplyReason[]>(
      ApiConstants.ENDPOINTS.DATA_TABLES.APPLY_REASONS,
    );
  }

  public getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(ApiConstants.ENDPOINTS.DATA_TABLES.BRANCHES);
  }

  public getUserRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(
      ApiConstants.ENDPOINTS.DATA_TABLES.USER_ROLES,
    );
  }
}

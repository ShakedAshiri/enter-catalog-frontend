import { environment } from "../../../environments/environment";

export class ApiConstants {
  private static readonly BASE_URL = environment.apiUrl;

  static readonly ENDPOINTS = {
    // User related endpoints
    USERS: {
      WORKERS: `${ApiConstants.BASE_URL}/user/workers`,
      ALL_USERS: `${ApiConstants.BASE_URL}/user`,
      PUBLIC_USER: `${ApiConstants.BASE_URL}/user/public/:id`,
      SECURE_USER: `${ApiConstants.BASE_URL}/user/:id`,
      PROFILE: `${ApiConstants.BASE_URL}/user/profile`
    },

    // Authentication endpoints
    AUTH: {
      LOGIN: `${ApiConstants.BASE_URL}/auth/login`,
      LOGOUT: `${ApiConstants.BASE_URL}/auth/logout`,
      REFRESH: `${ApiConstants.BASE_URL}/auth/refresh`,
      RESET_PASSWORD: `${ApiConstants.BASE_URL}/auth/reset-password`
    },

    // Data table endpoints
    DATA_TABLES: {
      CATEGORIES: `${ApiConstants.BASE_URL}/data-table/categories`
    }
  } as const;
}

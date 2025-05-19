import { environment } from '../../../environments/environment';

export class ApiConstants {
  private static readonly BASE_URL = environment.apiUrl;

  static readonly ENDPOINTS = {
    // User related endpoints
    USERS: {
      WORKERS: `${ApiConstants.BASE_URL}/user/workers`,
      ALL_USERS: `${ApiConstants.BASE_URL}/user`,
      PUBLIC_USER: `${ApiConstants.BASE_URL}/user/public/:id`,
      SECURE_USER: `${ApiConstants.BASE_URL}/user/:id`,
      PROFILE: `${ApiConstants.BASE_URL}/user/profile`,
      UPDATE: `${ApiConstants.BASE_URL}/user/update/:id`,
      CREATE: `${ApiConstants.BASE_URL}/user`,
      DEACTIVATE: `${ApiConstants.BASE_URL}/user/deactivate/:id`,
    },

    // User works endpoints
    WORKS: {
      CREATE: `${ApiConstants.BASE_URL}/work`,
      UPDATE: `${ApiConstants.BASE_URL}/work/:id`,
    },

    // Authentication endpoints
    AUTH: {
      LOGIN: `${ApiConstants.BASE_URL}/auth/login`,
      LOGOUT: `${ApiConstants.BASE_URL}/auth/logout`,
      REFRESH: `${ApiConstants.BASE_URL}/auth/refresh`,
      RESET_PASSWORD: `${ApiConstants.BASE_URL}/auth/change-password`,
    },

    // Data table endpoints
    DATA_TABLES: {
      CATEGORIES: `${ApiConstants.BASE_URL}/data-table/categories`,
      APPLY_REASONS: `${ApiConstants.BASE_URL}/data-table/apply-reasons`,
      BRANCHES: `${ApiConstants.BASE_URL}/data-table/branches`,
      USER_ROLES: `${ApiConstants.BASE_URL}/data-table/user-roles`,
    },

    // Email endpoints
    EMAIL: {
      CONTACT_US: `${ApiConstants.BASE_URL}/email/contact-us`,
    },
  } as const;

  static buildUrl(
    url: string,
    params: Record<string, string | number>,
  ): string {
    let result = url;
    Object.keys(params).forEach((key) => {
      result = result.replace(`:${key}`, params[key].toString());
    });
    return result;
  }
}

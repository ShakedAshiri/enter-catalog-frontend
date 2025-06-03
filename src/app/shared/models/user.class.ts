import { Branch } from './data-tables/branch.class';
import { Category } from './data-tables/category.class';
import { Status } from './data-tables/status.class';
import { UserRole } from './data-tables/userRole.class';
import { UserWork } from './userWork.class';

export class User {
  constructor(
    public username: string,
    public email: string,
    public displayName: string,
    public password: string,
    public isPasswordReset: boolean,
    public isAvailable: boolean,

    // External providers' user fields (google, facebook, etc.)
    public isEmailVerified: boolean = false,
    public authProvider: AuthProvider,
    public providerId: string,

    public id?: number,
    public userRole?: UserRole,
    public status?: Status,
    public tagline?: string,
    public description?: string,
    public image?: string,
    public categories?: Category[],
    public branch?: Branch,
    public works?: UserWork[],
    public token?: string,
  ) {}
}

export type AuthProvider =
  | 'LOCAL' // Username/password
  | 'GOOGLE'
  | 'MICROSOFT'
  | 'FACEBOOK'
  | 'GITHUB'
  | 'LINKEDIN'
  | 'APPLE';

import { Branch } from "./data-tables/branch.class";
import { Category } from "./data-tables/category.class";
import { Status } from "./data-tables/status.class";
import { UserRole } from "./data-tables/userRole.class";
import { UserWork } from "./userWork.class";

export class User {

  constructor(
    public id: string,
    public username: string,
    public displayname: string,
    public password: string,
    public role: UserRole,
    public isPasswordReset: boolean,
    public status: Status,
    public tagline?: string,
    public description?: string,
    //public image?: string,
    public categories?: Category[],
    public branch?: Branch,
    public works?: UserWork[]
  ) {}

}



import { Injectable } from '@angular/core';
import { User } from '../models/user.class';
import { Category } from '../models/data-tables/category.class';
import { UserRole } from '../models/data-tables/userRole.class';
import { Status } from '../models/data-tables/status.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // TODO: DELETE
  animator = new Category("1", "animator", "אנימציה");
  uiux = new Category("1", "uiux", "UI\\UX");
  developer = new Category("1", "developer", "פיתוח תוכנה");

  // TODO: DELETE
  categories: Category[] = [
    this.animator, this.uiux, this.developer
  ]

  constructor() { }

  public getUsers() {
    return [
        new User("1", "moshe-avrahami", "משה-אברהמי", "123",
                 new UserRole("1", "1"), false, new Status("1", "1"),
                 "עיצוב גרפי", "בוגר המחלקה לעיצוב חזותי ורוחני באקדמיה", [this.animator]),
        new User("1", "dana-gotman", "דנה גוטמן", "123",
                  new UserRole("1", "1"), false, new Status("1", "1"),
                  "UI\\UX", "מפתחת ui\\ux עם 3 שנות נסיון בתחום.", [this.uiux]),
        new User("1", "rotem-levi", "רותם לוי", "123",
                  new UserRole("1", "1"), false, new Status("1", "1"),
                  "אנימציה ופיתוח משחקים", "סיים תואר בהצטיינות יתרה", [this.developer]),
        new User("1", "meital nachmani", "מיטל נחמני", "123",
                 new UserRole("1", "1"), false, new Status("1", "1"),
                 "עיצוב גרפי", "בוגר המחלקה לעיצוב חזותי ורוחני באקדמיה", [this.animator, this.uiux]),
        new User("1", "roy-amadi", "רועי עמדי", "123",
                 new UserRole("1", "1"), false, new Status("1", "1"),
                 "UI\UX", "מפתחת ui\\ux עם 3 שנות נסיון בתחום.", [this.uiux]),
        new User("1", "ela-advaa", "אלה אדווה", "123",
                 new UserRole("1", "1"), false, new Status("1", "1"),
                 "אנימציה ופיתוח משחקים", "סיים תואר בהצטיינות יתרה", [this.animator]),
        new User("1", "moshe-avrahami", "משה-אברהמי", "123",
                  new UserRole("1", "1"), false, new Status("1", "1"),
                  "עיצוב גרפי", "בוגר המחלקה לעיצוב חזותי ורוחני באקדמיה", [this.uiux]),
        new User("1", "dana-gotman", "דנה גוטמן", "123",
                   new UserRole("1", "1"), false, new Status("1", "1"),
                   "UI\\UX", "מפתחת ui\\ux עם 3 שנות נסיון בתחום.", [this.uiux]),
        new User("1", "rotem-levi", "רותם לוי", "123",
                   new UserRole("1", "1"), false, new Status("1", "1"),
                   "אנימציה ופיתוח משחקים", "סיים תואר בהצטיינות יתרה", [this.animator]),
        new User("1", "michal-shalom", "מיכל שלום", "123",
                  new UserRole("1", "1"), false, new Status("1", "1"),
                  "עיצוב גרפי", "בוגר המחלקה לעיצוב חזותי ורוחני באקדמיה", [this.uiux]),
        new User("1", "roy-amadi", "רועי עמדי", "123",
                  new UserRole("1", "1"), false, new Status("1", "1"),
                  "UI\UX", "מפתחת ui\\ux עם 3 שנות נסיון בתחום.", [this.uiux]),
        new User("1", "ela-advaa", "אלה אדווה", "123",
                  new UserRole("1", "1"), false, new Status("1", "1"),
                  "אנימציה ופיתוח משחקים", "סיים תואר בהצטיינות יתרה", [this.animator])

      ];
  }
}

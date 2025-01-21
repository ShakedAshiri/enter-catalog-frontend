import { User } from './../../shared/models/user.class';
import { Component } from '@angular/core';
import { BannerComponent } from '../../banner/banner.component';
import { UserRole } from '../../shared/models/data-tables/userRole.class';
import { Status } from '../../shared/models/data-tables/status.class';
import { UsersGridComponent } from "../users-grid/users-grid.component";

@Component({
  selector: 'app-homepage',
  imports: [BannerComponent, UsersGridComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  users: User[] = [
    new User("1", "moshe-avrahami", "משה-אברהמי", "123",
             new UserRole("1", "1"), false, new Status("1", "1"),
             "עיצוב גרפי", "בוגר המחלקה לעיצוב חזותי ורוחני באקדמיה"),
    new User("1", "dana-gotman", "דנה גוטמן", "123",
              new UserRole("1", "1"), false, new Status("1", "1"),
              "UI\\UX", "מפתחת ui\\ux עם 3 שנות נסיון בתחום."),
    new User("1", "rotem-levi", "רותם לוי", "123",
              new UserRole("1", "1"), false, new Status("1", "1"),
              "אנימציה ופיתוח משחקים", "סיים תואר בהצטיינות יתרה"),
    new User("1", "michal-shalom", "משה-אברהמי", "123",
             new UserRole("1", "1"), false, new Status("1", "1"),
             "עיצוב גרפי", "בוגר המחלקה לעיצוב חזותי ורוחני באקדמיה"),
    new User("1", "roy-amadi", "רועי עמדי", "123",
             new UserRole("1", "1"), false, new Status("1", "1"),
             "UI\UX", "מפתחת ui\\ux עם 3 שנות נסיון בתחום."),
    new User("1", "ela-advaa", "אלה אדווה", "123",
             new UserRole("1", "1"), false, new Status("1", "1"),
             "אנימציה ופיתוח משחקים", "סיים תואר בהצטיינות יתרה")

  ];
}

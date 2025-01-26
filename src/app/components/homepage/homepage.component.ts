import { User } from './../../shared/models/user.class';
import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../../banner/banner.component';
import { UserRole } from '../../shared/models/data-tables/userRole.class';
import { Status } from '../../shared/models/data-tables/status.class';
import { UsersGridComponent } from './users-grid/users-grid.component';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { Category } from '../../shared/models/data-tables/category.class';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule, BannerComponent, UsersGridComponent, AboutComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  animator = new Category("1", "animator");
  uiux = new Category("1", "uiux");
  developer = new Category("1", "developer");

  users: User[] = [
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
  visibleUsers : User[] = [];
  itemsPerPage = 6;
  currentPage = 1;

  get hasMoreItems(): boolean {
    return this.visibleUsers.length < this.users.length;
  }

  ngOnInit() {
    this.loadInitialItems();
  }

  loadInitialItems() {
    this.visibleUsers = this.users.slice(0, this.itemsPerPage);
  }

  loadMore() {
    const nextItems = this.users.slice(
      this.visibleUsers.length,
      this.visibleUsers.length + this.itemsPerPage
    );
    this.visibleUsers = [...this.visibleUsers, ...nextItems];
  }
}

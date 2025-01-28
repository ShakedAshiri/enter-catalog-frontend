import { User } from './../../shared/models/user.class';
import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../../banner/banner.component';
import { UserRole } from '../../shared/models/data-tables/userRole.class';
import { Status } from '../../shared/models/data-tables/status.class';
import { UsersGridComponent } from './users-grid/users-grid.component';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { Category } from '../../shared/models/data-tables/category.class';
import { CategoryFilterComponent } from "./category-filter/category-filter.component";

@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    BannerComponent,
    UsersGridComponent,
    AboutComponent,
    CategoryFilterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  animator = new Category("1", "animator", "אנימציה");
  uiux = new Category("1", "uiux", "UI\\UX");
  developer = new Category("1", "developer", "פיתוח תוכנה");

  categories: Category[] = [
    this.animator, this.uiux, this.developer
  ]

  private users: User[] = [
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
  filteredUsers : User[] = [];
  itemsPerPageCount : number = 6;
  itemsPerPage : number;

  get hasMoreItems(): boolean {
    return this.visibleUsers.length < this.filteredUsers.length;
  }

  ngOnInit() {
    this.loadInitialItems();
  }

  loadInitialItems() {
    this.itemsPerPage = this.itemsPerPageCount;
    this.visibleUsers = this.users.slice(0, this.itemsPerPage);
    this.filteredUsers = this.users;
  }

  loadMore() {
    this.itemsPerPage += this.itemsPerPageCount;

    const nextItems = this.filteredUsers.slice(
      this.visibleUsers.length,
      this.visibleUsers.length + this.itemsPerPageCount
    );
    this.visibleUsers = [...this.visibleUsers, ...nextItems];
  }

  filterUsers(categoryFilter: Set<Category>) {
    this.filteredUsers = categoryFilter.size === 0
                          ? this.users
                          : this.users.filter(user =>
                              Array.from(categoryFilter).some(
                              category => user.categories.includes(category)
                            )
                          );


    this.visibleUsers = this.filteredUsers.slice(0, this.itemsPerPage);
  }
}

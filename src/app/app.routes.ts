import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { hasRoleGuard } from './shared/guards/has-role.guard';
import { Role } from './shared/constants/role';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  {
    path: 'profile/:id',
    component: ProfilePageComponent,
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: [Role.ADMIN, Role.TEAMLEAD],
    },
  },
];

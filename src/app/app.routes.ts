import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { hasRoleGuard } from './shared/guards/has-role.guard';
import { Role } from './shared/constants/role';
import { ControlPanelComponent } from './components/admin-dashboard/control-panel/control-panel.component';
import { UsersManagementComponent } from './components/admin-dashboard/user-management/user-management.component';

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
    children: [
      { path: '', redirectTo: 'control-panel', pathMatch: 'full' },
      { path: 'control-panel', component: ControlPanelComponent },
      { path: 'user-management', component: UsersManagementComponent }
    ]
  },
];

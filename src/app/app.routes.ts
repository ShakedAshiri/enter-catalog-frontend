import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  {
    path: 'profile/:id',
    component: ProfilePageComponent
  }
];

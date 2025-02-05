import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PopupModalService } from '../../shared/services/popup-modal.service';
import { LoginComponent } from '../auth/login/login.component';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule,
            MatButtonModule,
            MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private popupModalService: PopupModalService) {}

  openLoginForm(): void {
    const loginDialogRef = this.popupModalService.open(LoginComponent);

    loginDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Form submitted:', result);
      }
    });
  }
}

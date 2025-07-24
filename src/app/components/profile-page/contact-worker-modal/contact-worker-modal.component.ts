import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-contact-worker-modal',
  imports: [MatInputModule],
  templateUrl: './contact-worker-modal.component.html',
  styleUrl: './contact-worker-modal.component.scss',
})
export class ContactWorkerModalComponent {
  constructor(private readonly authService: AuthService) {}

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }
}

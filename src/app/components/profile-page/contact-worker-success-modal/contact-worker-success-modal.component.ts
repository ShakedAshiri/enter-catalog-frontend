import { Component } from '@angular/core';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';

@Component({
  selector: 'app-contact-worker-success-modal',
  imports: [],
  templateUrl: './contact-worker-success-modal.component.html',
  styleUrl: './contact-worker-success-modal.component.scss',
})
export class ContactWorkerSuccessModalComponent extends BaseModalComponent {
  override submit() {
    return null;
  }
}

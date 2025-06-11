import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ModalWrapperComponent } from '../../modal-wrapper/modal-wrapper.component';

@Component({
  selector: 'app-success-modal',
  imports: [MatIconModule, ModalWrapperComponent],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss',
})
export class SuccessModalComponent {
  text: string;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    // Use the dialog data if available
    if (data && data.text) {
      this.text = data.text;
    }
  }
}

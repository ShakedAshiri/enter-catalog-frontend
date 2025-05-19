import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalWrapperComponent } from '../../../../shared/components/modal-wrapper/modal-wrapper.component';

interface Data {
  workerId: number;
}

@Component({
  selector: 'app-user-deactivation',
  imports: [ModalWrapperComponent],
  templateUrl: './user-deactivation.component.html',
  styleUrl: './user-deactivation.component.scss',
})
export class UserDeactivationComponent {
  workerId: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data?: Data) {
    if (data.workerId) this.workerId = data.workerId;
  }

  submit() {
    return this.workerId;
  }
}

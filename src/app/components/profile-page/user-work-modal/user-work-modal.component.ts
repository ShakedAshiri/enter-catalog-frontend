import { Component, inject } from '@angular/core';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HiddenSubmitComponent } from '../../../shared/components/hidden-submit/hidden-submit.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-work-modal',
  imports: [
    ModalWrapperComponent,
    ServerErrorComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    HiddenSubmitComponent,
    MatProgressSpinner,
  ],
  templateUrl: './user-work-modal.component.html',
  styleUrl: './user-work-modal.component.scss',
})
export class UserWorkModalComponent extends BaseModalComponent {
  showServerError: boolean = false;
  isFormSubmitting: boolean = false;
  private subscriptions: Subscription[] = [];

  private fb = inject(FormBuilder);
  form: FormGroup;
  tempPassControl: FormControl; // TODO: different control

  submit() {}
}

import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import { MatInputModule } from '@angular/material/input';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import { HiddenSubmitComponent } from '../../../shared/components/hidden-submit/hidden-submit.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    ModalWrapperComponent,
    MatInputModule,
    ServerErrorComponent,
    HiddenSubmitComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './client-login.component.html',
  styleUrl: './client-login.component.scss',
})
export class ClientLoginComponent extends BaseModalComponent {
  isProduction = environment.production;
  showLoginServerError = false;

  private fb = inject(FormBuilder);
  form: FormGroup;
  nameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e ']+$"),
  ]);
  emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor() {
    super();

    this.form = this.fb.group({
      name: this.nameControl,
      email: this.emailControl,
    });
  }

  override submit(): void {
    throw new Error('Method not implemented.');
  }
}

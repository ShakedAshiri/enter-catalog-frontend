import { Component, inject, OnInit } from '@angular/core';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import { MatInputModule } from '@angular/material/input';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import { HiddenSubmitComponent } from '../../../shared/components/hidden-submit/hidden-submit.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-signup',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    ModalWrapperComponent,
    MatInputModule,
    ServerErrorComponent,
    HiddenSubmitComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './client-signup.component.html',
  styleUrl: './client-signup.component.scss',
})
export class ClientSignupComponent
  extends BaseModalComponent
  implements OnInit
{
  isProduction = environment.production;
  showLoginServerError = false;
  isFormSubmitting = false;

  private fb = inject(FormBuilder);
  form: FormGroup;

  override submit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}

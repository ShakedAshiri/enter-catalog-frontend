import { Component, inject, OnInit } from '@angular/core';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import { MatInputModule } from '@angular/material/input';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import { HiddenSubmitComponent } from '../../../shared/components/hidden-submit/hidden-submit.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../shared/services/auth.service';

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
  showSignupServerError = false;
  isFormSubmitting = false;

  private fb = inject(FormBuilder);
  form: FormGroup;
  displayNameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e ']+$"),
    Validators.minLength(2),
  ]);
  emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100),
    Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
  ]);
  repasswordControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100),
    Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
  ]);

  constructor(private authService: AuthService) {
    super();

    this.form = this.fb.group(
      {
        displayname: this.displayNameControl,
        email: this.emailControl,
        password: this.passwordControl,
        repassword: this.repasswordControl,
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password').value;
    const rePassword = group.get('repassword').value;

    const repasswordControl = group.get('repassword');

    if (password !== rePassword) {
      repasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Clear the error if passwords match
    const currentErrors = repasswordControl.errors;
    if (currentErrors) {
      delete currentErrors['passwordMismatch'];
      repasswordControl.setErrors(
        Object.keys(currentErrors).length ? currentErrors : null,
      );
    }

    return null;
  }

  override submit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}

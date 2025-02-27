import { Component, inject } from '@angular/core';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    ModalWrapperComponent,
    MatInputModule,
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent extends BaseModalComponent {
  private subscriptions: Subscription[] = [];

  private fb = inject(FormBuilder);
  form: FormGroup;
  tempPassControl: FormControl;
  newPassControl: FormControl;
  newPassConfirmControl: FormControl;

  constructor(private authService: AuthService) {
    super();

    this.tempPassControl = this.fb.control('', [Validators.required]);
    this.newPassControl = this.fb.control('', [
      Validators.required,
      Validators.minLength(5),
    ]);
    this.newPassConfirmControl = this.fb.control('', [Validators.required]);

    this.form = this.fb.group(
      {
        tempPass: this.tempPassControl,
        newPass: this.newPassControl,
        newPassConfirm: this.newPassConfirmControl,
      },
      { validators: this.passwordMatchValidator }
    );
  }

  submit(): void {
    if (this.form.valid) {
      const sub = this.authService
        .resetPassword(this.form.value.tempPass, this.form.value.newPass)
        .subscribe({
          next: () => {
            this.close(this.form.value);
          },
          error: (error) => {
            console.error('Error fetching data:', error);
          },
        });
      this.subscriptions.push(sub);
    }
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('newPass').value;
    const confirmPassword = group.get('newPassConfirm').value;

    const confirmControl = group.get('newPassConfirm');

    if (password !== confirmPassword) {
      confirmControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Clear the error if passwords match
    const currentErrors = confirmControl.errors;
    if (currentErrors) {
      delete currentErrors['passwordMismatch'];
      confirmControl.setErrors(
        Object.keys(currentErrors).length ? currentErrors : null
      );
    }

    return null;
  }

  ngOnDestory() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

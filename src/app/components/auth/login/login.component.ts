import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import { HiddenSubmitComponent } from '../../../shared/components/hidden-submit/hidden-submit.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends BaseModalComponent {
  private subscriptions: Subscription[] = [];

  private fb = inject(FormBuilder);
  form: FormGroup;
  nameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e ']+$"),
  ]);
  passwordControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);

  isProduction = environment.production;
  showLoginServerError = false;

  isFormSubmitting = false;

  constructor(private authService: AuthService) {
    super();

    this.form = this.fb.group({
      name: this.nameControl,
      password: this.passwordControl,
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.isFormSubmitting = true;

      const sub = this.authService
        .login(this.form.value.name, this.form.value.password)
        .subscribe({
          next: (result) => {
            this.isFormSubmitting = false;
            this.close(result);
          },
          error: (error) => {
            if (!this.isProduction) {
              console.error('Error fetching data:', error);
            }

            this.isFormSubmitting = false;
            this.showLoginServerError = true;
          },
        });
      this.subscriptions.push(sub);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

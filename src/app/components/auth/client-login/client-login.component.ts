import { Component, inject, OnInit } from '@angular/core';
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
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-login',
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
  templateUrl: './client-login.component.html',
  styleUrl: './client-login.component.scss',
})
export class ClientLoginComponent extends BaseModalComponent implements OnInit {
  private subscriptions: Subscription[] = [];

  isProduction = environment.production;
  showLoginServerError = false;
  isFormSubmitting = false;

  private fb = inject(FormBuilder);
  form: FormGroup;
  emailControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);

  constructor(private authService: AuthService) {
    super();

    this.form = this.fb.group({
      email: this.emailControl,
      password: this.passwordControl,
    });
  }

  ngOnInit(): void {
    // Render Google button after view init
    setTimeout(() => {
      this.renderGoogleButton('google-signin-button');
    }, 100);
  }

  override submit(): void {
    if (this.form.valid) {
      this.isFormSubmitting = true;

      const sub = this.authService
        .login(this.form.value.email, this.form.value.password)
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

  renderGoogleButton(elementId: string): void {
    if (window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'filled_blue',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          locale: 'he',
          width: '338',
        },
      );
    }
  }

  signup() {
    this.close('signup');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

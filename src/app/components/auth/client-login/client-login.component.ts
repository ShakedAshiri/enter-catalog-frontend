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
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';

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
  private subscriptions: Subscription[] = [];

  isProduction = environment.production;
  showLoginServerError = false;
  isFormSubmitting = false;

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

  constructor(private authService: AuthService) {
    super();

    this.form = this.fb.group({
      name: this.nameControl,
      email: this.emailControl,
    });
  }

  override submit(): void {
    if (this.form.valid) {
      this.isFormSubmitting = true;

      const sub = this.authService
        .login(this.form.value.name, this.form.value.email)
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

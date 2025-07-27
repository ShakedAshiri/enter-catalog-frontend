import {
  Component,
  ElementRef,
  inject,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import phoneNumberValidator from '../../../shared/validators/phoneNumber.validator';
import { HiddenSubmitComponent } from '../../../shared/components/hidden-submit/hidden-submit.component';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import noOnlySpacesValidator from '../../../shared/validators/no-only-spaces.validator';
import { emailWithTLDValidator } from '../../../shared/validators/email.validator';

@Component({
  selector: 'app-contact-worker-modal',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatError,
    ReactiveFormsModule,
    HiddenSubmitComponent,
  ],
  templateUrl: './contact-worker-modal.component.html',
  styleUrl: './contact-worker-modal.component.scss',
})
export class ContactWorkerModalComponent extends BaseModalComponent {
  private subscriptions: Subscription[] = [];

  isProduction = environment.production;
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
    emailWithTLDValidator(),
  ]);

  phoneNumberControl: FormControl = new FormControl('', [
    phoneNumberValidator(),
  ]);

  applicationContentControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(500),
    Validators.pattern(
      '^[0-9a-zA-Z\u0590-\u05FF\u200f\u200e\\n ()\'\\\\\\-"`,.!?;:/]+$',
    ),
    noOnlySpacesValidator(),
  ]);

  constructor(private readonly authService: AuthService) {
    super();

    this.form = this.fb.group({
      displayName: this.displayNameControl,
      email: this.emailControl,
      phoneNumber: this.phoneNumberControl,
      applicationContent: this.applicationContentControl,
    });
  }

  override submit(): void {
    this.isFormSubmitting = true;

    // const sub = this.authService
    //   .clientSignUp(
    //     this.form.value.displayName,
    //     this.form.value.email,
    //     this.form.value.password,
    //   )
    //   .subscribe({
    //     next: (result) => {
    //       this.isFormSubmitting = false;
    //       this.close(result);
    //     },
    //     error: ({ error }) => {
    //       if (!this.isProduction) {
    //         console.error('Error fetching data:', error);
    //       }

    //       this.isFormSubmitting = false;
    //       // this.showSignUpServerError = true;
    //       // this.signUpServerErrorString = error.message[0];
    //     },
    //   });
    // this.subscriptions.push(sub);
  }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnDestroy() {}
}

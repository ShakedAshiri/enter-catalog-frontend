import { Component, Inject, Optional } from '@angular/core';
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../shared/models/user.class';
import { UserService } from '../../../shared/services/user.service';

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
  worker: User;

  private subscriptions: Subscription[] = [];

  isProduction = environment.production;
  isFormSubmitting = false;
  form: FormGroup;

  displayNameControl!: FormControl;
  emailControl!: FormControl;
  phoneNumberControl!: FormControl;
  applicationContentControl!: FormControl;

  isLoggedIn = false;

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();

    if (data && data.worker) {
      this.worker = data.worker;
    }

    this.isLoggedIn = this.authService.isLoggedIn();

    this.displayNameControl = new FormControl(
      '',
      [
        !this.isLoggedIn && Validators.required,
        Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e ']+$"),
        Validators.minLength(2),
      ].filter(Boolean),
    ); // remove false validators

    this.emailControl = new FormControl(
      '',
      [!this.isLoggedIn && Validators.required, emailWithTLDValidator()].filter(
        Boolean,
      ),
    );

    this.phoneNumberControl = new FormControl(
      '',
      [!this.isLoggedIn && phoneNumberValidator()].filter(Boolean),
    );

    this.applicationContentControl = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(500),
      Validators.pattern(
        '^[0-9a-zA-Z\u0590-\u05FF\u200f\u200e\\n ()\'\\\\\\-"`,.!?;:/]+$',
      ),
      noOnlySpacesValidator(),
    ]);

    this.form = this.fb.group({
      displayName: this.displayNameControl,
      email: this.emailControl,
      phoneNumber: this.phoneNumberControl,
      applicationContent: this.applicationContentControl,
    });
  }

  override submit(): void {
    this.isFormSubmitting = true;

    const contactWorkerDto = {
      applicationContent: this.applicationContentControl.value,
      workerId: this.worker.id,
      creationDate: new Date().toString(),
      ...(!this.isLoggedIn && {
        displayName: this.displayNameControl.value,
        email: this.emailControl.value,
      }),
    };

    const sub = this.userService.contactWorker(contactWorkerDto).subscribe({
      next: (result) => {
        console.log(result);
        this.isFormSubmitting = false;
        this.close();
      },
      error: ({ error }) => {
        if (!this.isProduction) {
          console.error('Error fetching data:', error);
        }

        this.isFormSubmitting = false;
        // this.showSignUpServerError = true;
        // this.signUpServerErrorString = error.message[0];
      },
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {}
}

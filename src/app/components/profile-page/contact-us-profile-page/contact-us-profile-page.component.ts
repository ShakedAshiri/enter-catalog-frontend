import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import { ApplyReason } from '../../../shared/models/data-tables/applyReason.class';
import { ContactUsService } from '../../../shared/services/contact-us.service';
import { PopupModalService } from '../../../shared/services/popup-modal.service';
import { DataTableService } from '../../../shared/services/data-table.service';
import { SuccessModalComponent } from '../../../shared/components/success-modal/success-modal.component';

@Component({
  selector: 'app-contact-us-profile-page',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ServerErrorComponent,
    NgIf,
  ],
  templateUrl: './contact-us-profile-page.component.html',
  styleUrl: './contact-us-profile-page.component.scss',
})
export class ContactUsProfilePageComponent {
  private subscriptions: Subscription[] = []; // Store multiple subscriptions
  isButtonDisabled = false;
  isFormSubmitting = false;
  isProduction = environment.production;

  applyReasons: ApplyReason[] = [];
  showApplyReasonsServerError = false;

  loadApplyReasons() {
    this.subscriptions.push(
      this.dataTableService.getApplyReasons().subscribe({
        next: (response: ApplyReason[]) => {
          this.applyReasons = response;
        },

        error: (error) => {
          if (!this.isProduction) console.error(`Error fetching data:`, error);
          this.showApplyReasonsServerError = true;
        },
      }),
    );
  }

  contactUsForm: FormGroup;
  nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
  ]);
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  applyReasonsControl = new FormControl(
    [],
    [Validators.required, this.arrayOfNumbersValidator],
  );

  constructor(
    private contactUsService: ContactUsService,
    private popupModalService: PopupModalService,
    private fb: FormBuilder,
    private dataTableService: DataTableService,
  ) {}

  ngOnInit() {
    this.contactUsForm = this.fb.group({
      name: this.nameControl,
      email: this.emailControl,
      applyReasons: this.applyReasonsControl,
    });

    this.loadApplyReasons();
  }

  arrayOfNumbersValidator(
    control: FormControl,
  ): { [key: string]: boolean } | null {
    if (!control.value || !Array.isArray(control.value)) {
      return { notAnArray: true }; // Ensure it's an array
    }

    const invalidNumbers = control.value.some(
      (num) => typeof num !== 'number' || isNaN(num),
    );

    return invalidNumbers ? { invalidNumber: true } : null;
  }

  onSubmit(form: FormGroup) {
    this.isFormSubmitting = true;
    this.isButtonDisabled = true;

    const {
      value: { name, email, applyReasons },
    } = form;

    form.reset();

    const sub = this.contactUsService
      .submitContactUsForm({ name, email, applyReasons })
      .subscribe({
        next: () => {
          this.popupModalService.open(
            SuccessModalComponent,
            {},
            { text: 'תודה רבה! צוות החממה יצור קשר בהקדם' },
          );
          this.isFormSubmitting = false;
        },
        error: () => {
          this.popupModalService.open(ServerErrorComponent);
          this.isFormSubmitting = false;
        },
      });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}

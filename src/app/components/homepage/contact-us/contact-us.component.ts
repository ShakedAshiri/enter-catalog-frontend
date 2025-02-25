import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApplyReason } from '../../../shared/models/data-tables/applyReason.class';
import { NgFor } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactUsService } from '../../../shared/services/contact-us.service';
import { ContactUsForm } from '../../../shared/models/contactUsForm.class';

@Component({
  selector: 'app-contact-us',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgFor,
    ReactiveFormsModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  @Input({ required: true }) applyReasons!: ApplyReason[];
  isButtonDisabled = false;

  contactUsForm: FormGroup;
  nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
  ]);
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  applyReasonsControl = new FormControl(
    [],
    [Validators.required, this.arrayOfNumbersValidator]
  );

  constructor(
    private contactUsService: ContactUsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.contactUsForm = this.fb.group({
      name: this.nameControl,
      email: this.emailControl,
      applyReasons: this.applyReasonsControl,
    });
  }

  arrayOfNumbersValidator(
    control: FormControl
  ): { [key: string]: boolean } | null {
    if (!control.value || !Array.isArray(control.value)) {
      return { notAnArray: true }; // Ensure it's an array
    }

    const invalidNumbers = control.value.some(
      (num) => typeof num !== 'number' || isNaN(num)
    );

    return invalidNumbers ? { invalidNumber: true } : null;
  }

  submit() {
    this.isButtonDisabled = true;

    const {
      value: { name, email, applyReasons },
    } = this.contactUsForm;

    this.contactUsService
      .submitContactUsForm({ name, email, applyReasons })
      .subscribe(() => {
        window.location.reload();
      });
  }
}

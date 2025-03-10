import { Component, Inject, inject } from '@angular/core';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HiddenSubmitComponent } from '../../../shared/components/hidden-submit/hidden-submit.component';
import { UserWork } from '../../../shared/models/userWork.class';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import noOnlySpacesValidator from '../../../shared/validators/no-only-spaces.validator';

@Component({
  selector: 'app-user-work-modal',
  imports: [
    ModalWrapperComponent,
    ServerErrorComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    HiddenSubmitComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIf,
  ],
  templateUrl: './user-work-modal.component.html',
  styleUrl: './user-work-modal.component.scss',
})
export class UserWorkModalComponent extends BaseModalComponent {
  showServerError: boolean = false;
  isFormSubmitting: boolean = false;

  private fb = inject(FormBuilder);
  userWorkForm: FormGroup;
  titleControl: FormControl;
  descriptionControl: FormControl;
  imageControl: FormControl;

  userWork: UserWork;

  constructor(@Inject(MAT_DIALOG_DATA) public data?: any) {
    super();

    this.userWork = data?.userWork ?? null;

    // Create form controls
    this.titleControl = this.fb.control(
      this.userWork ? this.userWork.title : '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e '-]+$"),
        noOnlySpacesValidator(),
      ]
    );
    this.descriptionControl = this.fb.control(
      this.userWork ? this.userWork.description : '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(500),
        Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e\n '-,.!?;]+$"),
        noOnlySpacesValidator(),
      ]
    );
    this.imageControl = this.fb.control(
      this.userWork && this.userWork.images ? this.userWork.images[0].url : ''
    );

    // Create form
    this.userWorkForm = this.fb.group({
      title: this.titleControl,
      description: this.descriptionControl,
      image: this.imageControl,
    });
  }

  submit() {
    this.dialogRef.close(this.userWork);
  }
}

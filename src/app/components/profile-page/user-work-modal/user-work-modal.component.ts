import { Component, Inject, inject } from '@angular/core';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserWork } from '../../../shared/models/userWork.class';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import noOnlySpacesValidator from '../../../shared/validators/no-only-spaces.validator';
import { ImageService } from '../../../shared/services/image.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-work-modal',
  imports: [
    ModalWrapperComponent,
    ServerErrorComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIf,
    MatProgressSpinner,
  ],
  templateUrl: './user-work-modal.component.html',
  styleUrl: './user-work-modal.component.scss',
})
export class UserWorkModalComponent extends ModalWrapperComponent {
  showServerError: boolean = false;
  isFormSubmitting: boolean = false;
  isImageLoading: boolean = false;

  private fb = inject(FormBuilder);
  userWorkForm: FormGroup;
  titleControl: FormControl;
  descriptionControl: FormControl;
  imageControl: FormControl;

  userWork: UserWork;

  constructor(
    private imageService: ImageService,
    @Inject(MAT_DIALOG_DATA) public data?: any,
  ) {
    super();

    this.userWork = data?.userWork ?? null;

    // Create form controls
    this.titleControl = this.fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
      Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e '-]+$"),
      noOnlySpacesValidator(),
    ]);
    this.descriptionControl = this.fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(500),
      Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e\n '-,.!?;]+$"),
      noOnlySpacesValidator(),
    ]);
    this.imageControl = this.fb.control('');

    // Create form
    this.userWorkForm = this.fb.group({
      title: this.titleControl,
      description: this.descriptionControl,
      image: this.imageControl,
    });

    if (this.userWork) {
      this.userWorkForm.patchValue(this.userWork);
    }
  }

  override submit() {
    const updatedUserWork: UserWork = {
      ...this.userWork,
      ...this.userWorkForm.value,
    };

    this.close(updatedUserWork);
  }

  onImageFileSelected(event: Event) {
    this.isImageLoading = true;
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Check if file is an image
    if (!this.imageService.isFileTypeAllowed(file)) {
      this.imageControl.setErrors({ invalidFileType: true });
      input.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageControl.setValue(e.target.result);
      this.isImageLoading = false;
    };

    reader.readAsDataURL(file);
  }
}

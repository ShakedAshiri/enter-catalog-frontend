import { Component, Inject, inject, ViewChild } from '@angular/core';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import {
  FormArray,
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
import { WorkImage } from '../../../shared/models/workImage.class';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-user-work-modal',
  imports: [
    ModalWrapperComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    NgIf,
    MatProgressSpinner,
    ScrollingModule,
  ],
  templateUrl: './user-work-modal.component.html',
  styleUrl: './user-work-modal.component.scss',
})
export class UserWorkModalComponent extends ModalWrapperComponent {
  isFormSubmitting: boolean = false;
  isImageLoading: boolean = false;
  override title: string = '';

  private fb = inject(FormBuilder);
  userWorkForm: FormGroup;
  titleControl: FormControl;
  descriptionControl: FormControl;
  imagesControl: FormArray<FormControl<WorkImage>>;

  userWork: UserWork;
  selectedImage: WorkImage;
  images: WorkImage[] = [];
  addedImages: string[] = [];

  isEditable: boolean = false;

  constructor(
    private imageService: ImageService,
    @Inject(MAT_DIALOG_DATA) public data?: any,
  ) {
    super();

    this.userWork = data?.userWork ?? null;
    this.isEditable = data?.isEditable ?? false;
    this.title = this.isEditable ? data?.title : this.userWork?.title;

    // For thumbnail scroll
    this.selectedImage = this.userWork?.images[0] ?? null;
    this.images = this.userWork?.images ?? [];

    // Create form controls
    this.titleControl = this.fb.control(
      { value: '', disabled: !this.isEditable },
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e '-]+$"),
        noOnlySpacesValidator(),
      ],
    );
    this.descriptionControl = this.fb.control(
      { value: '', disabled: !this.isEditable },
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(500),
        Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e\n '-,.!?;]+$"),
        noOnlySpacesValidator(),
      ],
    );
    this.imagesControl = this.fb.array(
      this.userWork?.images.map((image) => this.fb.control(image)) || [
        this.fb.control(null),
      ],
    );

    // Create form
    this.userWorkForm = this.fb.group({
      title: this.titleControl,
      description: this.descriptionControl,
      images: this.imagesControl,
    });

    if (this.userWork) {
      this.userWorkForm.patchValue(this.userWork);
    }
  }

  override submit() {
    if (!this.isEditable) {
      this.close();
    } else {
      const updatedUserWork: UserWork = {
        ...this.userWorkForm.value,
        workFiles: [], // TODO - update so editable in form
        images: this.addedImages, // TODO: change so all images are sent. this is just for the poc
      };

      this.close(updatedUserWork);
    }
  }

  onImageFileSelected(event: Event) {
    this.isImageLoading = true;
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.isImageLoading = false;
      return;
    }

    const file = input.files[0];

    // Check if file is an image
    if (!this.imageService.isFileTypeAllowed(file)) {
      this.imagesControl.setErrors({ invalidFileType: true });
      input.value = '';
      this.isImageLoading = false;
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      // Remove initial placeholder if it's empty - relevant when editing work without initial image
      if (this.imagesControl.length === 1 && !this.imagesControl.at(0).value) {
        this.imagesControl.removeAt(0);
      }

      const newImg = new WorkImage(e.target.result);

      this.imagesControl.insert(0, this.fb.control(newImg));

      this.selectedImage = newImg;

      // Trigger reactivity - without this new thumbnail does not show
      this.images = [...this.imagesControl.value];

      this.isImageLoading = false;

      // TODO: change so all images are sent. this is just for the poc
      this.addedImages.push(newImg.url);
    };

    reader.readAsDataURL(file);
  }
}

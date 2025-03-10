import { PopupModalService } from './../../../shared/services/popup-modal.service';
import { Component, Input, SimpleChanges } from '@angular/core';
import { User } from '../../../shared/models/user.class';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EditableDirective } from '../../../shared/directives/editable.directive';
import { UserService } from '../../../shared/services/user.service';
import { environment } from '../../../../environments/environment';
import { NgIf } from '@angular/common';
import { ServerErrorComponent } from '../../../shared/components/server-error/server-error.component';
import { Category } from '../../../shared/models/data-tables/category.class';
import noOnlySpacesValidator from '../../../shared/validators/no-only-spaces.validator';

@Component({
  selector: 'app-user-info',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    EditableDirective,
    NgIf,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent {
  @Input({ required: true }) user!: User;
  @Input() isEditable: boolean = false;
  previousValues: { [key: string]: any } = {};
  imageErrorMessage: string | null = null;
  imageValid: boolean = false;

  getCategoryClass(category: Category): string {
    return `category--${category.name || 'default'}`;
  }

  private allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  userInfoForm: FormGroup;
  usernameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern('^[a-z]+$'),
  ]);
  displayNameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e ']+$"),
    noOnlySpacesValidator(),
  ]);
  imageControl = new FormControl('avatar.png', Validators.required);
  taglineControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e '-]+$"),
    noOnlySpacesValidator(),
  ]);
  descriptionControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(500),
    Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e\n '-,.!?;]+$"),
    noOnlySpacesValidator(),
  ]);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private popupModalService: PopupModalService
  ) {}

  ngOnInit() {
    this.userInfoForm = this.fb.group({
      username: this.usernameControl,
      displayName: this.displayNameControl,
      image: this.imageControl,
      tagline: this.taglineControl,
      description: this.descriptionControl,
    });

    this.userInfoForm.setValue({
      username: this.user.username,
      displayName: this.user.displayName,
      image: this.user.image,
      tagline: this.user.tagline,
      description: this.user.description,
    });
  }

  startEditing(fieldName: string) {
    // Store the current value in case we need to cancel
    this.previousValues[fieldName] = this.userInfoForm.get(fieldName).value;
  }

  saveEdit(fieldName: string) {
    if (this.userInfoForm.get(fieldName).valid) {
      this.imageErrorMessage = null;
      // If the user wants to later change image,
      // by default the save btn should be disabled
      this.imageValid = false;

      const newValue = this.userInfoForm.get(fieldName).value;
      const updatedUserData = { [fieldName]: newValue };

      this.userService.updateUser(this.user.id, updatedUserData).subscribe({
        next: (result) => {
          delete this.previousValues[fieldName];
        },
        error: (error) => {
          if (!environment.production)
            console.error('Error fetching data:', error);

          this.popupModalService.open(ServerErrorComponent);
          this.cancelEdit(fieldName);
        },
      });
    }
  }

  cancelEdit(fieldName: string) {
    // Revert to previous value
    this.userInfoForm.get(fieldName).setValue(this.previousValues[fieldName]);

    delete this.previousValues[fieldName];

    this.imageErrorMessage = null;
    // If the user wants to later change image,
    // by default the save btn should be disabled
    this.imageValid = false;
  }

  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.imageValid = false;
      return;
    }

    const file = input.files[0];

    // Check if file is an image
    if (!this.isFileTypeAllowed(file)) {
      this.imageErrorMessage = 'נא לבחור קובץ תמונה (JPEG, PNG, GIF, או WebP)';
      this.imageValid = false;
      input.value = '';
      return;
    }

    // Check aspect ratio
    this.checkAspectRatio(file).then((isValidRatio) => {
      if (isValidRatio) {
        this.imageErrorMessage = null;
        this.imageValid = true;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.imageControl.setValue(e.target.result);
        };

        reader.readAsDataURL(file);
      } else {
        this.imageErrorMessage = 'יש לבחור תמונה בעלת יחס רוחב-גובה 1:1';
        this.imageValid = false;
        input.value = '';
      }
    });
  }

  private checkAspectRatio(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        // Allow a small tolerance for aspect ratio (e.g., 0.95 to 1.05)
        const isValid = Math.abs(aspectRatio - 1) < 0.05;
        resolve(isValid);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  private isFileTypeAllowed(file: File): boolean {
    return this.allowedFileTypes.includes(file.type);
  }
}

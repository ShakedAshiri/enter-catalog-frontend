import { ImageService } from './../../../../shared/services/image.service';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ModalWrapperComponent } from '../../../../shared/components/modal-wrapper/modal-wrapper.component';
import { MatInputModule } from '@angular/material/input';
import { HiddenSubmitComponent } from '../../../../shared/components/hidden-submit/hidden-submit.component';
import { User } from '../../../../shared/models/user.class';
import { Branch } from '../../../../shared/models/data-tables/branch.class';
import { Category } from '../../../../shared/models/data-tables/category.class';
import { Subscription } from 'rxjs';
import { DataTableService } from '../../../../shared/services/data-table.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Role } from '../../../../shared/constants/role';
import { EditableDirective } from '../../../../shared/directives/editable.directive';
import { UserRole } from '../../../../shared/models/data-tables/userRole.class';
import noOnlySpacesValidator from '../../../../shared/validators/no-only-spaces.validator';
import { ServerErrorComponent } from '../../../../shared/components/server-error/server-error.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-details',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    HiddenSubmitComponent,
    MatProgressSpinnerModule,
    ModalWrapperComponent,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    EditableDirective,
    ServerErrorComponent,
    NgIf,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private fb = inject(FormBuilder);
  form: FormGroup;

  categories: Category[] = [];
  branches: Branch[] = [];
  userRoles: UserRole[] = [];

  user: User;

  imageValid: boolean = false;
  imageErrorMessage: string | null = null;
  previousImage: string;
  defaultAvatar: string;

  imageControl = new FormControl('');
  usernameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern("^[a-zA-Z']+$"),
    Validators.minLength(2),
  ]);
  displayNameControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e ']+$"),
    Validators.minLength(2),
  ]);
  descriptionControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(500),
    Validators.pattern(
      '^[0-9a-zA-Z\u0590-\u05FF\u200f\u200e\n ()\'\\-"`,.!?;]+$',
    ),
    noOnlySpacesValidator(),
  ]);

  isAvailableControl: FormControl = new FormControl('');
  branchControl: FormControl = new FormControl('', [Validators.required]);
  categoriesControl: FormControl = new FormControl('', [Validators.required]);

  isProduction = environment.production;
  isError = false;

  constructor(
    private dataTableService: DataTableService,
    private imageService: ImageService,
    @Inject(MAT_DIALOG_DATA) public data?: any,
  ) {
    this.form = this.fb.group({
      image: this.imageControl,
      displayName: this.displayNameControl,
      username: this.usernameControl,
      description: this.descriptionControl,
      isAvailable: this.isAvailableControl,
      branch: this.branchControl,
      categories: this.categoriesControl,
      password: 'Aa123456!', // TODO: change!!
    });

    this.user = data?.user;

    // Set branch for non-admins
    // Only admins can create users from a different branch
    if (!this.isAdmin) {
      this.form.patchValue({
        branch: this.user?.branch.id,
      });
    }

    this.defaultAvatar = this.imageService.defaultAvatar;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.dataTableService.getCategories().subscribe({
        next: (response: Category[]) => {
          this.categories = response;
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          this.isError = true;
        },
      }),
    );

    this.subscriptions.push(
      this.dataTableService.getBranches().subscribe({
        next: (response: Branch[]) => {
          this.branches = response;
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          this.isError = true;
        },
      }),
    );

    this.subscriptions.push(
      this.dataTableService.getUserRoles().subscribe({
        next: (response: UserRole[]) => {
          this.userRoles = response;

          this.form.addControl('userRole', this.fb.control(Role.WORKER));
        },
        error: (error) => {
          if (!this.isProduction) console.error('Error fetching data:', error);
          this.isError = true;
        },
      }),
    );
  }

  submit(): User {
    if (this.form.valid) {
      return this.form.value;
    }

    return null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get isAdmin(): boolean {
    return this.user?.userRole.id === Role.ADMIN;
  }

  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.imageValid = false;
      return;
    }

    const file = input.files[0];

    // Check if file is an image
    if (!this.imageService.isFileTypeAllowed(file)) {
      this.imageErrorMessage = 'נא לבחור קובץ תמונה (JPEG, PNG, GIF, או WebP)';
      this.imageValid = false;
      input.value = '';
      return;
    }

    // Check aspect ratio
    this.imageService.checkAspectRatio(file).then((isValidRatio) => {
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

  editImage() {
    // Store the current value in case we need to cancel
    this.previousImage = this.form.get('image').value;
  }

  saveImage() {
    delete this.previousImage;
  }

  cancelImage() {
    this.form.get('image').setValue(this.previousImage);

    delete this.previousImage;
  }
}

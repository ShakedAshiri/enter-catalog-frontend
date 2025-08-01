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
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
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
import usernameValidator from '../../../../shared/validators/username.validator';

@Component({
  selector: 'app-user-details',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatProgressSpinner,
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

  previousCategory = null;
  previousBranch = null;
  isLoadingCategoryAndBranch = false;
  private categoriesLoaded = false;
  private branchesLoaded = false;

  user: User;
  worker?: User;
  title = 'יצירת מקבל שירות חדש';

  imageValid: boolean = false;
  imageErrorMessage: string | null = null;
  previousImage: string;
  defaultAvatar: string;

  imageControl = new FormControl('');
  usernameControl: FormControl = new FormControl('', [usernameValidator()]);
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
  isAvailableControl: FormControl = new FormControl(false);
  branchControl: FormControl = new FormControl('', [Validators.required]);
  categoriesControl: FormControl = new FormControl('', [Validators.required]);
  emailControl: FormControl = new FormControl('', [Validators.email]);
  resetPasswordControl: FormControl = new FormControl(false);

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
      email: this.emailControl,
      description: this.descriptionControl,
      isAvailable: this.isAvailableControl,
      branch: this.branchControl,
      categories: this.categoriesControl,
      resetPassword: this.resetPasswordControl,
      password: 'Aa123456!', // TODO: change!!
    });

    this.user = data?.user;
    this.worker = data?.worker;

    if (this.worker) {
      this.title = 'עריכת מקבל שירות';
      this.isLoadingCategoryAndBranch = true;
    }

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

          if (this.worker) {
            this.form.patchValue({
              categories: this.worker.categories.map((category) => category.id),
            });
          }

          this.categoriesLoaded = true;
          this.checkDataLoaded();
        },
        error: (error) => {
          if (!this.isProduction)
            console.error('Error fetching categories:', error);
          this.isError = true;
        },
      }),
    );

    this.subscriptions.push(
      this.dataTableService.getBranches().subscribe({
        next: (response: Branch[]) => {
          this.branches = response;

          if (this.worker) {
            this.form.patchValue({ branch: this.worker.branch.id });
          }

          this.branchesLoaded = true;
          this.checkDataLoaded();
        },
        error: (error) => {
          if (!this.isProduction)
            console.error('Error fetching branches:', error);
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

    if (this.worker) {
      this.form.patchValue({
        image: this.worker.image,
        displayName: this.worker.displayName,
        username: this.worker.username,
        email: this.worker.email,
        description: this.worker.description,
        isAvailable: this.worker.isAvailable,
        password: 'Aa123456!', // TODO: change!!
      });
    }
  }

  checkDataLoaded() {
    if (this.categoriesLoaded && this.branchesLoaded) {
      this.isLoadingCategoryAndBranch = false;
    }
  }

  submit(): User {
    if (this.form.valid) {
      if (!this.worker) return this.form.value;
      return { ...this.form.value, id: this.worker.id };
    }

    return null;
  }

  changePassword() {
    this.form.value.password = this.generatePassword();
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

  generatePassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$';

    const allChars = lowercase + uppercase + numbers + symbols;

    // Ensure the password includes at least one of each type
    const getRandom = (charset: string) =>
      charset[Math.floor(Math.random() * charset.length)];

    let password = [
      getRandom(lowercase),
      getRandom(uppercase),
      getRandom(numbers),
      getRandom(symbols),
    ];

    for (let i = password.length; i < length; i++) {
      password.push(getRandom(allChars));
    }

    // Shuffle password array
    return password.sort(() => Math.random() - 0.5).join('');
  }
}

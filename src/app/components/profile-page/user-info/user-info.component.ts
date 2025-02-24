import { Component, Input, SimpleChanges } from '@angular/core';
import { User } from '../../../shared/models/user.class';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EditableDirective } from '../../../shared/directives/editable.directive';
import { UserService } from '../../../shared/services/user.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-info',
  imports: [
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    EditableDirective,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent {
  @Input({ required: true }) user!: User;
  @Input() isEditable: boolean = false;
  previousValues: { [key: string]: any } = {};

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
  ]);
  imageControl = new FormControl('avatar.png', Validators.required);
  taglineControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
  ]);
  descriptionControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(500),
  ]);

  constructor(private fb: FormBuilder, private userService: UserService) {}

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

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    console.log('Username', form.value.username);
    console.log('Display Name', form.value.displayName);
    console.log('Image', form.value.image);
    console.log('Tagline', form.value.tagline);
    console.log('Description', form.value.description);
  }

  startEditing(fieldName: string) {
    // Store the current value in case we need to cancel
    this.previousValues[fieldName] = this.userInfoForm.get(fieldName).value;
  }

  saveEdit(fieldName: string) {
    if (this.userInfoForm.get(fieldName).valid) {
      const newValue = this.userInfoForm.get(fieldName).value;
      const updatedUserData = { [fieldName]: newValue };

      this.userService.updateUser(this.user.id, updatedUserData).subscribe({
        next: (result) => {
          delete this.previousValues[fieldName];
        },
        error: (error) => {
          if (!environment.production)
            console.error('Error fetching data:', error);
          // TODO: show error to user
        },
      });
    }
  }

  cancelEdit(fieldName: string) {
    // Revert to previous value
    this.userInfoForm.get(fieldName).setValue(this.previousValues[fieldName]);

    delete this.previousValues[fieldName];
  }
}

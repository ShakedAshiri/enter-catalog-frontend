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

@Component({
  selector: 'app-user-info',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent {
  @Input({ required: true }) user!: User;

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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userInfoForm = this.fb.group({
      username: this.usernameControl,
      displayName: this.displayNameControl,
      image: this.imageControl,
      tagline: this.taglineControl,
      description: this.descriptionControl,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && changes['user'].currentValue) {
      this.userInfoForm.setValue({
        username: this.user.username,
        displayName: this.user.displayName,
        image: this.user.image,
        tagline: this.user.tagline,
        description: this.user.description,
      });
    }
  }

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    console.log('Username', form.value.username);
    console.log('Display Name', form.value.displayName);
    console.log('Image', form.value.image);
    console.log('Tagline', form.value.tagline);
    console.log('Description', form.value.description);
  }
}

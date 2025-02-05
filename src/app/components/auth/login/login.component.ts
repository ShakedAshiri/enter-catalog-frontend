import { Component, inject } from '@angular/core';
import { FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl
 } from '@angular/forms';
import { BaseModalComponent } from '../../../shared/components/base-modal/base-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalWrapperComponent } from '../../../shared/components/modal-wrapper/modal-wrapper.component';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    ModalWrapperComponent,
    MatInputModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseModalComponent {
  private fb = inject(FormBuilder);
  form: FormGroup;
  nameControl: FormControl = new FormControl('', [Validators.required,
                                                  Validators.pattern("^[a-zA-Z\u0590-\u05FF\u200f\u200e ']+$")]);
  passwordControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  constructor() {
    super();

    this.form = this.fb.group({
      name: this.nameControl,
      password: this.passwordControl
    });
  }

  submit(): void {
    if (this.form.valid) {
      // TODO: login
      this.close(this.form.value);
    }
  }
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (!/^(\+9725\d{8}|05\d{8})$/.test(value)) {
      return { stringIsntPhoneNumber: true };
    }

    return null;
  };
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function applicationContentValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!/^(\+972|0)([2-9])\d{7}$/.test(value)) {
      return { stringIsntPhoneNumber: true };
    }

    return null;
  };
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailWithTLDValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return value && !emailRegex.test(value) ? { invalidEmail: true } : null;
  };
}

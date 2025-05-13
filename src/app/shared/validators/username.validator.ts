import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return { required: true };
    }

    if (value.length < 2) {
      return { minlength: true };
    }

    if (value.length > 30) {
      return { maxlength: true };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return { alphabeticLettersAndOptionalSeparators: true };
    }

    if (/--|__|-_|_-/.test(value)) {
      return { disallowMultipleConsecutive: true };
    }

    return null;
  };
}

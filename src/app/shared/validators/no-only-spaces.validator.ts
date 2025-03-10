import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function noOnlySpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.trim().length === 0) {
      return { noOnlySpaces: true };
    }
    return null;
  };
}

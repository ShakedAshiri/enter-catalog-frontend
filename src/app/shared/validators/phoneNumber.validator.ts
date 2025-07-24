import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export default function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return { required: true };
    }

    if (value.length < 3) {
      return { minlength: true };
    }

    if (value.length > 500) {
      return { maxlength: true };
    }

    if (/<[^>]*>/.test(value)) {
      return { stringContainsHtmlTags: true };
    }

    if (/[@#₪&~{}\[\]><]/.test(value)) {
      return { stringContainsSpecialChars: true };
    }

    return null;
  };
}

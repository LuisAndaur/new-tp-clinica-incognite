import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function confirmPasswordValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        
      const password = formGroup.get('password');
      const password2 = formGroup.get('password2');
      const respuestaError = { noCoincide: 'La password no coincide' };

      if (password?.value !== password2?.value){
        formGroup.get('password')?.setErrors(respuestaError);
        return respuestaError;
      }
      else {
        formGroup.get('password')?.setErrors(null);
        return null;
      }
    };
  }
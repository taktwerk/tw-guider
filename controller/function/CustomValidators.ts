import {
    AbstractControl,
    ValidatorFn,
    FormControl,
    FormGroup,
    ValidationErrors
  } from '@angular/forms';
  
  export class CustomValidators {
    constructor() {}
  
    static onlyChar(): ValidatorFn {
      return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (control.value == '') return null;
  
        let re = new RegExp('^[a-zA-Z ]*$');
        if (re.test(control.value)) {
          return null;
        } else {
          return { onlyChar: true };
        }
      };
    }
    
    static matchValidator(
      matchTo: string, 
      reverse?: boolean
    ): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        if (control.parent && reverse) {
          const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
          if (c) {
            c.updateValueAndValidity();
          }
          return null;
        }
        return !!control.parent && !!control.parent.value && control.value === (control.parent?.controls as any)[matchTo].value ? null : { matching: true };
      };
    }

    static usDate(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        let usDatePattern = /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/;

        if (!control.value.match(usDatePattern)) {
          return { "usDate": true };
        }
        return null;
      }
    }
    
  }
  
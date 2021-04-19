import {FormControl} from '@angular/forms';

/**
 * check if the current and other field's value matches
 */

export function match_value(otherControlName: string) {
  let thisControl: FormControl;
  let otherControl: FormControl;
  return function matchOtherValidate(control: FormControl) {
    if (!control.parent) {
      return null;
    }
    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(otherControlName) as FormControl;
      if (!otherControl) {
        throw new Error('matchOtherValidator(): other control is not found in parent group');
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }
    if (!otherControl) {
      return null;
    }
    if (otherControl.value !== thisControl.value) {
      return {
        match_value: true
      };
    }
    return null;
  };
}


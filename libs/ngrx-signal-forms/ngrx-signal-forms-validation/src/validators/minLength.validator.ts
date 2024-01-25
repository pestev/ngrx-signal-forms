import { hasValidLength } from '@ngrx-signal-forms';
import { ValidatorFn }    from '../types/ngrx-signal-form-validation.types';

export function minLength(minLength: number): ValidatorFn {
  return controlState => {
    return isShortLength(controlState.value, minLength) ? {
      minLength: `${ controlState.id } length must be higher then ${ minLength }!`
    } : {};
  };
}

function isShortLength(value: unknown, minLength: number): boolean {
  if (!value || !hasValidLength(value)) {
    return false;
  }

  return value.length < minLength;
}

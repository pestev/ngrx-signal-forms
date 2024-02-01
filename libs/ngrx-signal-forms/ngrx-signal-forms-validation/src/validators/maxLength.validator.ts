import { hasValidLength } from '@ngrx-signal-forms';
import { ValidatorFn }    from '../types/ngrx-signal-form-validation.types';

export function maxLength(maxLength: number): ValidatorFn<string, unknown> {
  return controlState => {
    return isLongLength(controlState.value, maxLength) ? {
      maxLength: `${ controlState.id } length must be lower then ${ maxLength }!`
    } : {};
  };
}

function isLongLength(value: unknown, maxLength: number): boolean {
  if (!value || !hasValidLength(value)) {
    return false;
  }

  return value.length > maxLength;
}

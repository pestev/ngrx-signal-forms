import { isEmpty }     from '@ngrx-signal-forms';
import { ValidatorFn } from '../types/ngrx-signal-form-validation.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const required: ValidatorFn<any, unknown> = (controlState) => {
  return isEmpty(controlState.value) ? {
    required: `${ controlState.id } must not be empty!`
  } : {};
};

import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function setErrors(errors: Record<string, unknown>): NgrxSignalFormStateUpdateFn {
  return state => {

    const hasErrors = Object.keys(errors).length > 0;

    return Object.assign({}, state, {
      errors,
      hasErrors
    });
  };
}

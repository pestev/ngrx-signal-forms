import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function setErrors(errors: Record<string, unknown>): NgrxSignalFormStateUpdateFn {
  return state => {

    const hasErrors = Object.keys(errors).length > 0;

    // TODO maybe compare also when control has errors?
    if (!state.hasErrors && !hasErrors) {
      return state;
    }

    return Object.assign({}, state, {
      errors,
      hasErrors
    });
  };
}

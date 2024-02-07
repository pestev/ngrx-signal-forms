import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { isEmpty }                     from '../../utils/utils';

export function setErrors(errors: Record<string, unknown>, append = false): NgrxSignalFormStateUpdateFn {
  return state => {

    const e = append ? Object.assign({}, state.errors, errors) : errors;

    const hasErrors = !isEmpty(e) || !isEmpty(state.asyncErrors);

    // TODO maybe compare also when control has errors?
    if (!state.hasErrors && !hasErrors) {
      return state;
    }

    return Object.assign({}, state, {
      errors: e,
      hasErrors
    });
  };
}

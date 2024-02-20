import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { isEmpty }                     from '../../utils/common.utils';

export function setAsyncErrors(
  id: string,
  errors: Record<string, unknown>,
  append = false
): NgrxSignalFormStateUpdateFn {

  return state => {

    if (!id.startsWith(state.id)) {
      return null;
    }

    if (state.id !== id) {
      return state;
    }

    const e = append ? Object.assign({}, state.asyncErrors, errors) : errors;

    const hasErrors = !isEmpty(e) || !isEmpty(state.errors);

    // TODO maybe compare also when control has errors?
    if (!state.hasErrors && !hasErrors) {
      return state;
    }

    return Object.assign({}, state, {
      asyncErrors: e,
      hasErrors
    });
  };
}

import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { isEmpty }                     from '../../utils/common.utils';

export function setAsyncWarnings(
  id: string,
  warnings: Record<string, unknown>,
  append = false
): NgrxSignalFormStateUpdateFn {

  return state => {

    if (!id.startsWith(state.id)) {
      return null;
    }

    if (state.id !== id) {
      return state;
    }

    const w = append ? Object.assign({}, state.asyncWarnings, warnings) : warnings;

    const hasWarnings = !isEmpty(w) || !isEmpty(state.warnings);

    // TODO maybe compare also when control has warnings?
    if (!state.hasWarnings && !hasWarnings) {
      return state;
    }

    return Object.assign({}, state, {
      asyncWarnings: w,
      hasWarnings
    });
  };
}

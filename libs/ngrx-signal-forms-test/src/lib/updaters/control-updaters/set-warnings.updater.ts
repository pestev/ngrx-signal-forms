import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { isEmpty }                     from '../../utils/utils';

export function setWarnings(warnings: Record<string, unknown>, append = false): NgrxSignalFormStateUpdateFn {
  return state => {

    const w = append ? Object.assign({}, state.warnings, warnings) : warnings;

    const hasWarnings = !isEmpty(w) || !isEmpty(state.asyncWarnings);

    // TODO maybe compare also when control has warnings?
    if (!state.hasWarnings && !hasWarnings) {
      return state;
    }

    return Object.assign({}, state, {
      warnings: w,
      hasWarnings
    });
  };
}

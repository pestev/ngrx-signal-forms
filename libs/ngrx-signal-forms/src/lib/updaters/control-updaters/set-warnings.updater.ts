import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function setWarnings(warnings: Record<string, unknown>): NgrxSignalFormStateUpdateFn {
  return state => {

    const hasWarnings = Object.keys(warnings).length > 0;
    
    // TODO maybe compare also when control has warnings?
    if (!state.hasWarnings && !hasWarnings) {
      return state;
    }

    return Object.assign({}, state, {
      warnings,
      hasWarnings
    });
  };
}

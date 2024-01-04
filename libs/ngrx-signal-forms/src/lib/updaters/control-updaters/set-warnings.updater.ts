import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function setWarnings(warnings: Record<string, unknown>): NgrxSignalFormStateUpdateFn {
  return state => {

    const hasWarnings = Object.keys(warnings).length > 0;

    return Object.assign({}, state, {
      warnings,
      hasWarnings
    });
  };
}

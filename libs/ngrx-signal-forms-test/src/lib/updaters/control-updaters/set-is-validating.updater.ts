import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function setIsValidating(isValidating: boolean): NgrxSignalFormStateUpdateFn {
  return state => {

    if (state.isValidating === isValidating) {
      return state;
    }

    return Object.assign({}, state, {
      isValidating
    });
  };
}

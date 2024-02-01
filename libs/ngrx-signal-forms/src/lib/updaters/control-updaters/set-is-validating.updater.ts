import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function setIsValidating(isValidating: boolean): NgrxSignalFormStateUpdateFn {
  return state => {

    console.debug('validating: ', isValidating, state);

    if (state.isValidating === isValidating) {
      return state;
    }

    return Object.assign({}, state, {
      isValidating
    });
  };
}

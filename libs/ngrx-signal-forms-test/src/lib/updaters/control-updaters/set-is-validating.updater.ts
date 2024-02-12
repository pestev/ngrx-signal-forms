import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function setIsValidating(id: string, isValidating: boolean): NgrxSignalFormStateUpdateFn {

  return state => {

    if (!id.startsWith(state.id)) {
      return null;
    }

    if (state.id !== id) {
      return state;
    }

    if (state.isValidating === isValidating) {
      return state;
    }

    return Object.assign({}, state, {
      isValidating
    });
  };
}

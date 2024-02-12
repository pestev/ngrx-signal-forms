import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function markAsTouched(id: string): NgrxSignalFormStateUpdateFn {

  return state => {

    if (state.id.startsWith(id)) {
      return markControlAsTouched(state);
    }

    if (!id.startsWith(state.id)) {
      return null;
    }

    return state;
  };
}

const markControlAsTouched: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isTouched ? state : Object.assign({}, state, { isTouched: true });
};

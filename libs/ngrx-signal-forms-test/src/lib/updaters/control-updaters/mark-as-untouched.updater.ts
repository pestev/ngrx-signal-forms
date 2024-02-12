import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function markAsUntouched(id: string): NgrxSignalFormStateUpdateFn {

  return state => {

    if (state.id.startsWith(id)) {
      return markControlAsUntouched(state);
    }

    if (!id.startsWith(state.id)) {
      return null;
    }

    return state;
  };
}

const markControlAsUntouched: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isTouched ? Object.assign({}, state, { isTouched: false }) : state;
};

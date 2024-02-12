import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function markAsEnabled(id: string): NgrxSignalFormStateUpdateFn {

  return state => {

    if (state.id.startsWith(id)) {
      return markControlAsEnabled(state);
    }

    if (!id.startsWith(state.id)) {
      return null;
    }

    return state;
  };
}

const markControlAsEnabled: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isDisabled ? Object.assign({}, state, { isDisabled: false }) : state;
};

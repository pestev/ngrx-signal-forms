import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function markAsDisabled(id: string): NgrxSignalFormStateUpdateFn {

  return state => {

    if (state.id.startsWith(id)) {
      return markControlAsDisabled(state);
    }

    if (!id.startsWith(state.id)) {
      return null;
    }

    return state;
  };
}

const markControlAsDisabled: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isDisabled ? state : Object.assign({}, state, { isDisabled: true });
};

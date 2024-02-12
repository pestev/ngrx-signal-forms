import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function markAsDirty(id: string): NgrxSignalFormStateUpdateFn {

  return state => {

    if (state.id.startsWith(id)) {
      return markControlAsDirty(state);
    }

    if (!id.startsWith(state.id)) {
      return null;
    }

    return state;
  };
}

const markControlAsDirty: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isDirty ? state : Object.assign({}, state, { isDirty: true });
};

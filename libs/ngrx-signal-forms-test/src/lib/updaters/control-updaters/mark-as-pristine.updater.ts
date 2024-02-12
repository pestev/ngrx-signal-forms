import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';

export function markAsPristine(id: string): NgrxSignalFormStateUpdateFn {

  return state => {

    if (state.id.startsWith(id)) {
      return markControlAsPristine(state);
    }

    if (!id.startsWith(state.id)) {
      return null;
    }

    return state;
  };
}

const markControlAsPristine: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isDirty ? Object.assign({}, state, { isDirty: false }) : state;
};

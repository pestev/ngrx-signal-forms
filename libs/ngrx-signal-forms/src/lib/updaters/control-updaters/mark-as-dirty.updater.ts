import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { updateRecursive }             from '../ngrx-signal-form-control.updater';

export const markAsDirty: NgrxSignalFormStateUpdateFn = (state) => {
  const updatedState = updateRecursive(state, markControlAsDirty);

  return state === updatedState ? state : updatedState;
};

const markControlAsDirty: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isDirty ? state : Object.assign({}, state, { isDirty: true });
};

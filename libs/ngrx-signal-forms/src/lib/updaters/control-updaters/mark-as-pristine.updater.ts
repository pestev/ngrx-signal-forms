import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { updateRecursive }             from '../ngrx-signal-form-control.updater';

export const markAsPristine: NgrxSignalFormStateUpdateFn = (state) => {
  const updatedState = updateRecursive(state, markControlAsPristine);

  return state === updatedState ? state : updatedState;
};

const markControlAsPristine: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isDirty ? Object.assign({}, state, { isDirty: false }) : state;
};

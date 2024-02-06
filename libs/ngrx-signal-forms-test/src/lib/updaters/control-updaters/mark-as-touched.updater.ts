import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { updateRecursive }             from '../ngrx-signal-form-control.updater';

export const markAsTouched: NgrxSignalFormStateUpdateFn = (state) => {
  const updatedState = updateRecursive(state, markControlAsTouched);

  return state === updatedState ? state : updatedState;
};

const markControlAsTouched: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isTouched ? state : Object.assign({}, state, { isTouched: true });
};

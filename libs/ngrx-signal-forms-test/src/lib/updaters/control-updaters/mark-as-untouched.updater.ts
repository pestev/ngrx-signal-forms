import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { updateRecursive }             from '../ngrx-signal-form-control.updater';

export const markAsUntouched: NgrxSignalFormStateUpdateFn = (state) => {
  const updatedState = updateRecursive(state, markControlAsUntouched);

  return state === updatedState ? state : updatedState;
};

const markControlAsUntouched: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isTouched ? Object.assign({}, state, { isTouched: false }) : state;
};

import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { updateRecursive }             from '../ngrx-signal-form-control.updater';

export const markAsEnabled: NgrxSignalFormStateUpdateFn = (state) => {
  const updatedState = updateRecursive(state, markControlAsEnabled);

  return state === updatedState ? state : updatedState;
};

const markControlAsEnabled: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isDisabled ? Object.assign({}, state, { isDisabled: false }) : state;
};

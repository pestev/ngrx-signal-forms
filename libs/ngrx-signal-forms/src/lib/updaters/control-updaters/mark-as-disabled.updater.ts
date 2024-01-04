import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { updateRecursive }             from '../ngrx-signal-form-control.updater';

export const markAsDisabled: NgrxSignalFormStateUpdateFn = (state) => {
  const updatedState = updateRecursive(state, markControlAsDisabled);

  return state === updatedState ? state : updatedState;
};

const markControlAsDisabled: NgrxSignalFormStateUpdateFn = (state) => {
  return state.isDisabled ? state : Object.assign({}, state, { isDisabled: true });
};

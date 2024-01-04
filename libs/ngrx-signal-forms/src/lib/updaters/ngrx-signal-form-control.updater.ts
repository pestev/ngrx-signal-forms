import { BaseControl, NgrxSignalFormGroupControls, NgrxSignalFormStateUpdateFn } from '../types/ngrx-signal-form.types';
import { isFormGroupControl }                                                    from '../utils/ngrx-signal-form.utils';

/**
 * Tool for combine updaters into one updater.
 *
 * @param fns updaters
 *
 * @example
 * const updater = updatersPipe(setValue(newValue), markAsDirty)
 */
export function updatersPipe(
  ...fns: NgrxSignalFormStateUpdateFn[]
): NgrxSignalFormStateUpdateFn {

  return state => fns.reduce(
    (s, fn) => fn(s),
    state
  );
}

/**
 * Recursive apply update function to control and all child controls
 *
 * @param state
 * @param updateFn
 */
export function updateRecursive<
  TState extends BaseControl
>(state: TState, updateFn: NgrxSignalFormStateUpdateFn): TState {

  const updatedState = updateFn(state);
  const newState = state === updatedState ? state : updatedState;

  if (isFormGroupControl(state)) {
    const updatedControls = updateGroupControls(state.controls, updateFn);

    if (updatedControls === state.controls) {
      return newState;
    }

    return Object.assign({}, newState, {
      controls: updatedControls
    });
  }

  // if (isFormArrayControl(state)) {
  //   return updateArrayControls(state, updateFn);
  // }

  return newState;
}

function updateGroupControls<
  TValue extends object,
  TChildrenState extends NgrxSignalFormGroupControls<TValue>
>(controls: TChildrenState, updateFn: NgrxSignalFormStateUpdateFn): TChildrenState {

  let hasChanged = false;

  const updatedControls = Object.keys(controls).reduce((newControls, controlKey) => {
    const control = controls[controlKey as keyof typeof controls];

    const updatedControl =
      updateRecursive(control, updateFn);

    if (updatedControl === control) {
      return Object.assign(newControls, { [controlKey]: control });
    }

    hasChanged = true;
    return Object.assign(newControls, { [controlKey]: updatedControl });
  }, {}) as TChildrenState;

  return hasChanged ? updatedControls : controls;
}

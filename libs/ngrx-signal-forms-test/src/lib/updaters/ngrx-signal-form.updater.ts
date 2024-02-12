import { NgrxSignalFormState }                                                   from '../types/ngrx-signal-form-deduced.types';
import { BaseControl, NgrxSignalFormGroupControls, NgrxSignalFormStateUpdateFn } from '../types/ngrx-signal-form.types';
import {
  updateArrayBasedOnChildren,
  updateGroupBasedOnChildren
}                                                                                from '../utils/ngrx-signal-form-update.utils';
import { isFormArrayControl, isFormGroupControl }                                from '../utils/ngrx-signal-form.utils';

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

  return state => {
    let hasChanged = false;

    const updated = fns.reduce(
      (s, fn) => {
        const u = fn(s);

        if (u === null || u === s) {
          return s;
        }

        hasChanged = true;
        return u;
      },
      state
    );

    return hasChanged ? updated : state;
  };
}

/**
 * Recursive apply update function to control and all child controls
 *
 * @param state
 * @param updateFn
 */
export function ngrxSignalFormUpdater<
  TState extends BaseControl
>(state: TState, updateFn: NgrxSignalFormStateUpdateFn): TState {

  const updatedState = updateFn(state);

  if (updatedState === null) {
    return state;
  }

  const newState = state === updatedState ? state : updatedState;

  if (isFormGroupControl(state)) {
    const updatedControls = updateGroupControls(state.controls, updateFn);

    if (updatedControls === state.controls) {
      return newState;
    }

    return updateGroupBasedOnChildren(newState, updatedControls);
  }

  if (isFormArrayControl(state)) {
    const updatedControls = updateArrayControls(state.controls, updateFn);

    if (updatedControls === state.controls) {
      return newState;
    }

    return updateArrayBasedOnChildren(newState, updatedControls);
  }

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
      ngrxSignalFormUpdater(control, updateFn);

    if (updatedControl === control) {
      return Object.assign(newControls, { [controlKey]: control });
    }

    hasChanged = true;
    return Object.assign(newControls, { [controlKey]: updatedControl });
  }, {}) as TChildrenState;

  return hasChanged ? updatedControls : controls;
}

function updateArrayControls<
  TValue,
  TChildrenState extends NgrxSignalFormState<TValue>[] = NgrxSignalFormState<TValue>[]
>(
  controls: TChildrenState,
  updateFn: NgrxSignalFormStateUpdateFn
): TChildrenState {

  let hasChanged = false;

  const updatedControls = controls.map(control => {

    const updatedControl =
      ngrxSignalFormUpdater(control, updateFn);

    if (updatedControl === control) {
      return control;
    }

    hasChanged = true;
    return updatedControl;
  }) as TChildrenState;

  return hasChanged ? updatedControls : controls;
}

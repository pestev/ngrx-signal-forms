import { NgrxSignalFormState }                                   from '../types/ngrx-signal-form-deduced.types';
import {
  BaseControl,
  NgrxControlValue,
  NgrxSignalFormArray,
  NgrxSignalFormControl,
  NgrxSignalFormGroup,
  NgrxSignalFormGroupControls,
  NgrxSignalFormStateUpdateFn,
  Primitive
}                                                                from '../types/ngrx-signal-form.types';
import { isFormArrayControl, isFormControl, isFormGroupControl } from '../utils/ngrx-signal-form.utils';

export function ngrxSignalFormStateUpdater<TState extends BaseControl>(
  state: TState,
  id: string,
  updateFn: NgrxSignalFormStateUpdateFn
): TState {

  if (!id.startsWith(state.id)) {
    return state;
  }

  if (isFormGroupControl(state)) {
    return updateGroup(state, id, updateFn);
  }

  if (isFormArrayControl(state)) {
    return updateArray(state, id, updateFn);
  }

  if (isFormControl(state)) {
    return updateControl(state, id, updateFn);
  }

  throw new Error('Unknown form state!');
}

function updateControl<
  TValue extends Primitive,
  TState extends NgrxSignalFormControl<TValue>
>(
  state: TState,
  id: string,
  updateFn: NgrxSignalFormStateUpdateFn
): TState {

  if (state.id !== id) {
    return state;
  }

  const updated = updateFn(state);

  return updated === state ? state : updated;
}

function updateGroup<
  TValue extends object,
  TState extends NgrxSignalFormGroup<TValue>
>(
  state: TState,
  id: string,
  updateFn: NgrxSignalFormStateUpdateFn
): TState {

  if (id !== state.id) {
    const updatedControls = updateGroupControls(state.controls, id, updateFn);

    return updateGroupBasedOnChildren(state, updatedControls);
  }

  const updated = updateFn(state);

  return state === updated ? state : updated;
}

function updateArray<TValue, TState extends NgrxSignalFormArray<TValue>>(
  state: TState,
  id: string,
  updateFn: NgrxSignalFormStateUpdateFn
): TState {

  if (id !== state.id) {
    const updatedControls = updateArrayControls<TValue>(state.controls, id, updateFn);

    return updateArrayBasedOnChildren<TValue, TState>(state, updatedControls);
  }

  const updated = updateFn(state);

  return state === updated ? state : updated;
}

function updateGroupBasedOnChildren<
  TValue extends object,
  TState extends NgrxSignalFormGroup<TValue>,
  TChildrenState extends NgrxSignalFormGroupControls<TValue>
>(
  state: TState,
  updatedControls: TChildrenState
): TState {

  if (state.controls === updatedControls) {
    return state;
  }

  const value: Record<string, unknown> = {};
  const errors: Record<string, unknown> = {};
  const warnings: Record<string, unknown> = {};
  let isDirty = state.isDirty;
  let isTouched = state.isTouched;
  let hasErrors = state.hasErrors;
  let hasWarnings = state.hasWarnings;

  Object.keys(updatedControls).forEach(controlKey => {
    const control = updatedControls[controlKey as keyof typeof updatedControls];

    value[controlKey] = control.value;

    if (control.isDirty) {
      isDirty = true;
    }

    if (control.isTouched) {
      isTouched = true;
    }

    if (control.hasErrors) {
      hasErrors = true;
      errors[controlKey] = control.errors;
    }

    if (control.hasWarnings) {
      hasWarnings = true;
      warnings[controlKey] = control.warnings;
    }
  });

  return Object.assign({}, state, {
    value,
    isDirty,
    isTouched,
    hasErrors,
    hasWarnings,
    errors,
    warnings,
    controls: updatedControls
  });
}

function updateArrayBasedOnChildren<
  TValue,
  TState extends NgrxSignalFormArray<TValue>,
  TChildrenState extends NgrxSignalFormState<TValue>[] = NgrxSignalFormState<TValue>[]
>(
  state: TState,
  updatedControls: TChildrenState
): TState {

  if (state.controls === updatedControls) {
    return state;
  }

  const value: NgrxControlValue[] = [];
  let isDirty = state.isDirty;
  let isTouched = state.isTouched;

  updatedControls.forEach(control => {

    value.push(control.value);

    if (control.isDirty) {
      isDirty = true;
    }

    if (control.isTouched) {
      isTouched = true;
    }
  });

  return Object.assign({}, state, {
    value,
    isDirty,
    isTouched,
    controls: updatedControls
  });
}

function updateGroupControls<
  TValue extends object,
  TChildrenState extends NgrxSignalFormGroupControls<TValue>
>(
  controls: TChildrenState,
  id: string,
  updateFn: NgrxSignalFormStateUpdateFn
): TChildrenState {

  let hasChanged = false;

  const updatedControls = Object.keys(controls).reduce((newControls, controlKey) => {
    const control = controls[controlKey as keyof typeof controls];

    const updatedControl =
      ngrxSignalFormStateUpdater(control, id, updateFn);

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
  id: string,
  updateFn: NgrxSignalFormStateUpdateFn
): TChildrenState {

  let hasChanged = false;

  const updatedControls = controls.map(control => {

    const updatedControl =
      ngrxSignalFormStateUpdater(control, id, updateFn);

    if (updatedControl === control) {
      return control;
    }

    hasChanged = true;
    return updatedControl;
  }) as TChildrenState;

  return hasChanged ? updatedControls : controls;
}

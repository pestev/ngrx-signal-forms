import { NgrxSignalFormState } from '../types/ngrx-signal-form-deduced.types';
import {
  BaseControl,
  NgrxControlValue,
  NgrxSignalFormArray,
  NgrxSignalFormGroup,
  NgrxSignalFormGroupControls
}                              from '../types/ngrx-signal-form.types';

export function updateGroupBasedOnChildren<
  TValue extends object,
  TState extends BaseControl,
  TChildrenState extends NgrxSignalFormGroupControls<TValue>
>(
  state: TState,
  updatedControls: TChildrenState
): TState {

  if (state.controls === updatedControls) {
    return state;
  }

  let hasValueChanged = false;

  const value: Record<string, unknown> = {};
  const errors: Record<string, unknown> = {};
  const warnings: Record<string, unknown> = {};
  let isDirty = false;
  let isTouched = false;
  let hasErrors = false;
  let hasWarnings = false;
  let isValidating = false;

  Object.keys(updatedControls).forEach(controlKey => {
    const prevControl: BaseControl =
      (state as NgrxSignalFormGroup<TValue>).controls[controlKey as keyof typeof state.controls];
    const control =
      updatedControls[controlKey as keyof typeof updatedControls];

    if (prevControl.value !== control.value) {
      hasValueChanged = true;
    }
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

    if (control.isValidating) {
      isValidating = true;
    }
  });

  return Object.assign({}, state, {
    value: hasValueChanged ? value : state.value,
    isDirty,
    isTouched,
    hasErrors,
    hasWarnings,
    isValidating,
    errors,
    warnings,
    controls: updatedControls
  });
}

export function updateArrayBasedOnChildren<
  TValue,
  TState extends BaseControl,
  TChildrenState extends NgrxSignalFormState<TValue>[] = NgrxSignalFormState<TValue>[]
>(
  state: TState,
  updatedControls: TChildrenState
): TState {

  if (state.controls === updatedControls) {
    return state;
  }

  let hasValueChanged = false;

  const value: NgrxControlValue[] = [];
  const errors: Record<string, unknown> = {};
  const warnings: Record<string, unknown> = {};
  let isDirty = false;
  let isTouched = false;
  let hasErrors = false;
  let hasWarnings = false;
  let isValidating = false;

  updatedControls.forEach((control, key) => {

    const prevControl: BaseControl = (state as NgrxSignalFormArray<TValue>).controls[key];

    if (prevControl.value !== control.value) {
      hasValueChanged = true;
    }
    value.push(control.value);

    if (control.isDirty) {
      isDirty = true;
    }

    if (control.isTouched) {
      isTouched = true;
    }

    if (control.hasErrors) {
      hasErrors = true;
      errors[key] = control.errors;
    }

    if (control.hasWarnings) {
      hasWarnings = true;
      warnings[key] = control.warnings;
    }

    if (control.isValidating) {
      isValidating = true;
    }
  });

  return Object.assign({}, state, {
    value: hasValueChanged ? value : state.value,
    isDirty,
    isTouched,
    hasErrors,
    hasWarnings,
    isValidating,
    errors,
    warnings,
    controls: updatedControls
  });
}

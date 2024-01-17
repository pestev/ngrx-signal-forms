import { NgrxSignalFormState }                                        from '../types/ngrx-signal-form-deduced.types';
import { BaseControl, NgrxControlValue, NgrxSignalFormGroupControls } from '../types/ngrx-signal-form.types';

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

  const value: NgrxControlValue[] = [];
  const errors: Record<string, unknown> = {};
  const warnings: Record<string, unknown> = {};
  let isDirty = state.isDirty;
  let isTouched = state.isTouched;
  let hasErrors = state.hasErrors;
  let hasWarnings = state.hasWarnings;

  updatedControls.forEach((control, key) => {

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

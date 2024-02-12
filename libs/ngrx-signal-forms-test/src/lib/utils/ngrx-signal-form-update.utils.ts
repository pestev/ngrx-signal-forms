import { Observable, tap } from 'rxjs';
import {
  NgrxSignalFormState
}                          from '../types/ngrx-signal-form-deduced.types';
import {
  BaseControl,
  NgrxControlValue,
  NgrxSignalFormArray,
  NgrxSignalFormGroup,
  NgrxSignalFormGroupControls
}                          from '../types/ngrx-signal-form.types';
import {
  isEmpty
}                          from './utils';

/**
 * Ngrx signal store didn't provide DeepSignal for array so we need to get correct state manually
 */
export function getCorrectControlState<TFormValue>($source: Observable<{
  formValue: TFormValue,
  controlState: BaseControl,
  formState: NgrxSignalFormState<TFormValue>
}>) {

  return $source.pipe(
    tap(d => console.debug('source for correct control state: ', d))
  );
}

// export function getCorrectControlState<TFormValue> () {
//   return ($source: {
//     formValue: TFormValue,
//     controlState: BaseControl,
//     formState: NgrxSignalFormState<TFormValue>
//   }) => {
//
//     return $source;
//   }
// }

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
  const asyncErrors: Record<string, unknown> = {};
  const warnings: Record<string, unknown> = {};
  const asyncWarnings: Record<string, unknown> = {};
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
      if (!isEmpty(control.errors)) {
        errors[controlKey] = control.errors;
      }
      if (!isEmpty(control.asyncErrors)) {
        asyncErrors[controlKey] = control.asyncErrors;
      }
    }

    if (control.hasWarnings) {
      hasWarnings = true;
      if (!isEmpty(control.warnings)) {
        warnings[controlKey] = control.warnings;
      }
      if (!isEmpty(control.asyncWarnings)) {
        asyncWarnings[controlKey] = control.asyncWarnings;
      }
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
    asyncErrors,
    warnings,
    asyncWarnings,
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
  const asyncErrors: Record<string, unknown> = {};
  const warnings: Record<string, unknown> = {};
  const asyncWarnings: Record<string, unknown> = {};
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
      if (!isEmpty(control.errors)) {
        errors[key] = control.errors;
      }
      if (!isEmpty(control.asyncErrors)) {
        asyncErrors[key] = control.asyncErrors;
      }
    }

    if (control.hasWarnings) {
      hasWarnings = true;
      if (!isEmpty(control.warnings)) {
        warnings[key] = control.warnings;
      }
      if (!isEmpty(control.asyncWarnings)) {
        asyncWarnings[key] = control.asyncWarnings;
      }
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
    asyncErrors,
    warnings,
    asyncWarnings,
    controls: updatedControls
  });
}

import { NgrxSignalFormState } from '../types/ngrx-signal-form-deduced.types';
import {
  NgrxControlValue,
  NgrxSignalFormArray,
  NgrxSignalFormControl,
  NgrxSignalFormGroup,
  Primitive
}                              from '../types/ngrx-signal-form.types';
import { isObject }            from './utils';

export function creator<
  TValue extends NgrxControlValue
>(
  idPath: string,
  value: TValue
): NgrxSignalFormState<TValue> {

  if (isObject(value)) {
    return generateGroup(idPath, value as object) as NgrxSignalFormState<TValue>;
  }

  if (Array.isArray(value)) {
    return generateArray(idPath, value) as NgrxSignalFormState<TValue>;
  }

  return generateControl(idPath, value as Primitive) as NgrxSignalFormState<TValue>;
}

export function generateGroup<
  T extends object
>(
  id: string,
  value: T
): NgrxSignalFormGroup<T> {

  return {
    id,
    value,
    hasErrors: false,
    hasWarnings: false,
    isDisabled: false,
    isDirty: false,
    isTouched: false,
    errors: {},
    warnings: {},
    controls: generateGroupControls(id, value)
  };
}

function generateGroupControls<
  T extends object
>(
  idBase: string,
  value: T
): NgrxSignalFormGroup<T>['controls'] {

  const r = Object.entries(value).map(([ k, v ]) => [
    k,
    creator(`${ idBase }.${ k }`, v)
  ]);

  return Object.fromEntries(r);
}

function generateArray<
  T extends NgrxControlValue
>(
  id: string,
  value: T[]
): NgrxSignalFormArray<T> {

  return {
    id,
    value,
    hasErrors: false,
    hasWarnings: false,
    isDisabled: false,
    isDirty: false,
    isTouched: false,
    errors: {},
    warnings: {},
    controls: generateArrayControls(id, value)
  };
}

function generateArrayControls<
  TValue extends NgrxControlValue
>(
  idBase: string,
  value: Array<TValue>
): NgrxSignalFormArray<TValue>['controls'] {

  return value.map((v, i) => creator(`${ idBase }.${ i }`, v));
}

function generateControl<
  T extends Primitive
>(
  id: string,
  value: T
): NgrxSignalFormControl<T> {

  return {
    id,
    value,
    hasErrors: false,
    hasWarnings: false,
    isDisabled: false,
    isDirty: false,
    isTouched: false,
    errors: {},
    warnings: {}
  };
}

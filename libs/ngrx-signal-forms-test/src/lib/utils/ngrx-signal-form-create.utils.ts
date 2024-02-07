import { NgrxSignalFormState }   from '../types/ngrx-signal-form-deduced.types';
import {
  NgrxControlValue,
  NgrxSignalFormArray,
  NgrxSignalFormControl,
  NgrxSignalFormGroup,
  Primitive
}                                from '../types/ngrx-signal-form.types';
import { isObject, isPrimitive } from './utils';

export function creator<
  TValue
>(
  idPath: string,
  value: TValue,
  vIdPath: string | null = null
): NgrxSignalFormState<TValue> {

  if (isObject(value)) {
    return generateGroup(idPath, value as object, vIdPath) as NgrxSignalFormState<TValue>;
  }

  if (Array.isArray(value)) {
    return generateArray(idPath, value, vIdPath) as NgrxSignalFormState<TValue>;
  }

  if (isPrimitive(value)) {
    return generateControl(idPath, value as Primitive, vIdPath) as NgrxSignalFormState<TValue>;
  }

  throw new Error('Unknown value type');
}

export function generateGroup<
  T extends object
>(
  id: string,
  value: T,
  vId: string | null
): NgrxSignalFormGroup<T> {

  return {
    id,
    vId: vId || id,
    value,
    hasErrors: false,
    hasWarnings: false,
    isDisabled: false,
    isDirty: false,
    isTouched: false,
    isValidating: false,
    errors: {},
    warnings: {},
    asyncErrors: {},
    asyncWarnings: {},
    controls: generateGroupControls(id, value, vId)
  };
}

function generateGroupControls<
  T extends object
>(
  idBase: string,
  value: T,
  vIdBase: string | null
): NgrxSignalFormGroup<T>['controls'] {

  const idPrefix = idBase ? `${ idBase }.` : '';

  const r = Object.entries(value).map(([ k, v ]) => [
    k,
    creator(`${ idPrefix }${ k }`, v, `${ vIdBase || idBase }.${ k }`)
  ]);

  return Object.fromEntries(r);
}

function generateArray<
  T extends NgrxControlValue
>(
  id: string,
  value: T[],
  vId: string | null
): NgrxSignalFormArray<T> {

  return {
    id,
    vId: vId || id,
    value,
    hasErrors: false,
    hasWarnings: false,
    isDisabled: false,
    isDirty: false,
    isTouched: false,
    isValidating: false,
    errors: {},
    asyncErrors: {},
    warnings: {},
    asyncWarnings: {},
    controls: generateArrayControls(id, value, vId || id)
  };
}

function generateArrayControls<
  TValue extends NgrxControlValue
>(
  idBase: string,
  value: Array<TValue>,
  vIdBase: string | null
): NgrxSignalFormArray<TValue>['controls'] {

  const idPrefix = idBase ? `${ idBase }.` : '';

  return value.map((v, i) => creator(`${ idPrefix }${ i }`, v, vIdBase));
}

function generateControl<
  T extends Primitive
>(
  id: string,
  value: T,
  vId: string | null
): NgrxSignalFormControl<T> {

  return {
    id,
    vId: vId || id,
    value,
    hasErrors: false,
    hasWarnings: false,
    isDisabled: false,
    isDirty: false,
    isTouched: false,
    isValidating: false,
    errors: {},
    asyncErrors: {},
    warnings: {},
    asyncWarnings: {}
  };
}

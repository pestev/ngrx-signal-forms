import {
  BaseControl,
  NgrxSignalFormArray,
  NgrxSignalFormControl,
  NgrxSignalFormGroup,
  Primitive
}                   from '../types/ngrx-signal-form.types';
import { isObject } from './utils';

export function isFormControl<TValue extends Primitive>(
  c: unknown
): c is NgrxSignalFormControl<TValue> {

  return isBaseControl(c) && !Object.hasOwn(c, 'controls');
}

export function isFormArrayControl<TValue>(
  c: unknown
): c is NgrxSignalFormArray<TValue> {

  return isBaseControl(c) && Object.hasOwn(c, 'controls') && Array.isArray(c['controls']);
}

export function isFormGroupControl<TValue extends object>(
  c: unknown
): c is NgrxSignalFormGroup<TValue> {

  return isBaseControl(c) && Object.hasOwn(c, 'controls') && isObject(c['controls']);
}

function isBaseControl(c: unknown): c is BaseControl & { controls?: unknown } {

  return isObject(c)
    && Object.hasOwn(c, 'id')
    && Object.hasOwn(c, 'isDirty')
    && Object.hasOwn(c, 'isDisabled')
    && Object.hasOwn(c, 'value')
    && Object.hasOwn(c, 'hasErrors');
}

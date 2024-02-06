import { DeepSignal } from '@ngrx/signals/src/deep-signal';
import {
  BaseControl,
  NgrxSignalFormArray,
  NgrxSignalFormControl,
  NgrxSignalFormGroup,
  Primitive
}                     from '../types/ngrx-signal-form.types';
import { isObject }   from './utils';

export function isFormControlSignal<TValue extends Primitive>(
  s: DeepSignal<unknown>
): s is DeepSignal<NgrxSignalFormControl<TValue>> {

  return isFormControl(s());
}

export function isFormGroupControlSignal<TValue extends object>(
  s: DeepSignal<unknown>
): s is DeepSignal<NgrxSignalFormGroup<TValue>> {

  return isFormGroupControl(s());
}

export function isFormArrayControlSignal<TValue>(
  s: DeepSignal<unknown>
): s is DeepSignal<NgrxSignalFormArray<TValue>> {

  return isFormArrayControl(s());
}

export function isFormControl<TValue extends Primitive>(
  c: unknown
): c is NgrxSignalFormControl<TValue> {

  return isBaseControl(c) && !Object.hasOwn(c, 'controls');
}

export function isFormGroupControl<TValue extends object>(
  c: unknown
): c is NgrxSignalFormGroup<TValue> {

  return isBaseControl(c) && Object.hasOwn(c, 'controls') && isObject(c['controls']);
}

export function isFormArrayControl<TValue>(
  c: unknown
): c is NgrxSignalFormArray<TValue> {

  return isBaseControl(c) && Object.hasOwn(c, 'controls') && Array.isArray(c['controls']);
}

function isBaseControl(c: unknown): c is BaseControl & { controls?: unknown } {

  return isObject(c)
    && Object.hasOwn(c, 'id')
    && Object.hasOwn(c, 'isDirty')
    && Object.hasOwn(c, 'isDisabled')
    && Object.hasOwn(c, 'value')
    && Object.hasOwn(c, 'hasErrors');
}

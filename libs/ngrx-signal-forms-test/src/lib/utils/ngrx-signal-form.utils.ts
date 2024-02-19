import { Signal }   from '@angular/core';
import {
  DeepSignal
}                   from '@ngrx/signals/src/deep-signal';
import {
  BaseControl,
  NgrxSignalFormArray,
  NgrxSignalFormControl,
  NgrxSignalFormGroup,
  Primitive
}                   from '../types/ngrx-signal-form.types';
import {
  iterableFormState
}                   from './iterators/iterable-form-state';
import { isObject } from './utils';

export function findAllControlsStates(
  state: BaseControl,
  search: unknown,
  key: keyof BaseControl = 'id'
): BaseControl[] | null {

  const result: BaseControl[] = [];

  for (const controlState of iterableFormState(state)) {
    if (controlState[key] === search) {
      result.push(controlState);
    }
  }

  return result.length ? result : null;
}

export function isFormControlSignal<TValue extends Primitive>(
  s: Signal<unknown>
): s is Signal<NgrxSignalFormControl<TValue>> {

  return isFormControl(s());
}

/*
 TODO remove DeepSignal dependency, because it is not exported from @ngrx/signals
 or better: ask ngrx if its possible to publish DeepSignal interface
 */
export function isFormGroupControlSignal<TValue extends object>(
  s: DeepSignal<unknown>
): s is DeepSignal<NgrxSignalFormGroup<TValue>> {

  return isFormGroupControl(s());
}

export function isFormArrayControlSignal<TValue>(
  s: Signal<unknown>
): s is Signal<NgrxSignalFormArray<TValue>> {

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
    && Object.hasOwn(c, 'vId')
    && Object.hasOwn(c, 'value');

}

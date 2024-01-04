import { NgrxSignalForm, NgrxSignalFormControl, NgrxSignalFormControlValue } from '../types/ngrx-signal-forms.types';
import { isObject, isPrimitive }                                             from './utils';

export function generate<TPath extends string, TValue>(
  basePath: TPath,
  value: TValue
): NgrxSignalForm<TPath, TValue> {

  if (isObject(value)) {
    return generateObject(basePath, value);
  }

  if (Array.isArray(value)) {
    return generateArray(basePath, value);
  }

  if (isPrimitive(value)) {
    return generatePrimitive(basePath, value);
  }

  throw new Error('Unsupported value! Can not generate form.');
}

export function generateObject<
  TPath extends string,
  TValue extends object
>(basePath: TPath, value: TValue): NgrxSignalForm<TPath, TValue> {

  return Object.entries(value).reduce((r, [ k, v ]) => {
    const path = `${ basePath }.${ k }`;

    return Object.assign(r, generate(path, v));
  }, {} as NgrxSignalForm<TPath, TValue>);
}

export function generateArray<
  TPath extends string,
  TValue extends ArrayLike<unknown>
>(basePath: TPath, value: TValue): NgrxSignalForm<TPath, TValue> {

  return Array.from(value).reduce<NgrxSignalForm<TPath, TValue>>((r, v, i) => {
    const path = `${ basePath }.${ i }`;

    return Object.assign(r, generate(path, v));
  }, {} as NgrxSignalForm<TPath, TValue>);
}

export function generatePrimitive<
  TPath extends string,
  TValue extends NgrxSignalFormControlValue
>(id: TPath, value: TValue): NgrxSignalForm<TPath, TValue> {

  const control: NgrxSignalFormControl<TValue> = {
    id,
    isDirty: false,
    isDisabled: false,
    hasErrors: false,
    value
  };

  return {
    [id]: control
  } as NgrxSignalForm<TPath, TValue>;
}

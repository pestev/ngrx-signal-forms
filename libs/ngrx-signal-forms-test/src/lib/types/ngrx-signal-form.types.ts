import { NgrxSignalFormState } from './ngrx-signal-form-deduced.types';

export type NgrxSignalFormStateUpdateFn = <T extends BaseControl>(state: T) => T | null;

export type Primitive = string | number | boolean | null | undefined;

export type NgrxControlValue = object | Primitive | NgrxControlValue[];

export interface BaseControl<TValue = unknown> {
  id: string;
  vId: string;
  isDirty: boolean;
  isDisabled: boolean;
  isTouched: boolean;
  isValidating: boolean;
  hasWarnings: boolean;
  hasErrors: boolean;
  warnings: Record<string, unknown>;
  asyncWarnings: Record<string, unknown>;
  errors: Record<string, unknown>;
  asyncErrors: Record<string, unknown>;
  value: TValue;
  controls?: unknown;
}

export interface NgrxSignalFormControl<
  TValue extends Primitive
> extends BaseControl<TValue> {
}

export type NgrxSignalFormGroupControls<TValue extends object> =
  { [K in keyof TValue]: NgrxSignalFormState<TValue[K]> }

export interface NgrxSignalFormGroup<
  TValue extends object
> extends BaseControl<TValue> {

  controls: NgrxSignalFormGroupControls<TValue>;
}

export interface NgrxSignalFormArray<TValue> extends BaseControl<TValue[]> {

  controls: NgrxSignalFormState<TValue>[];
}

import { BaseControl, Primitive } from '@ngrx-signal-forms-test';
import { Observable }             from 'rxjs';

// TODO infer type of controlState value, so controlState will have correct value and not unknown
export type AsyncValidatorFn<TFormState> = (
  controlState: BaseControl,
  formState: TFormState
) => Observable<Record<string, unknown>>

export type AsyncValidatorConfig<TValue, TFormState> =
  TValue extends Primitive
  ? AsyncValidatorFn<TFormState> | AsyncValidatorFn<TFormState>[]
  : TValue extends Array<infer E>
    ? AsyncValidatorConfig<E, TFormState>
    : TValue extends object
      ? { [K in keyof TValue & string]?: AsyncValidatorConfig<TValue[K], TFormState> }
      : never;

import { NgrxSignalFormState, Primitive } from '@ngrx-signal-forms-test';
import { Observable }                     from 'rxjs';

export type AsyncValidatorFn<TValue, TFormState> = (
  controlState: NgrxSignalFormState<TValue>,
  formState: TFormState
) => Observable<Record<string, unknown>>

export type AsyncValidatorConfig<TValue, TFormState> =
  TValue extends Primitive
  ? AsyncValidatorFn<TValue, TFormState> | AsyncValidatorFn<TValue, TFormState>[]
  : TValue extends Array<infer E>
    ? AsyncValidatorConfig<E, TFormState>
    : TValue extends object
      ? { [K in keyof TValue & string]?: AsyncValidatorConfig<TValue[K], TFormState> }
      : never;

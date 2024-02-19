import { NgrxSignalFormState, Primitive } from '@ngrx-signal-forms-test';

export type ValidatorFn<TValue, TFormState> = (
  controlState: NgrxSignalFormState<TValue>,
  formState: TFormState
) => Record<string, unknown>

export type ValidatorConfig<TValue, TFormState> =
  TValue extends Primitive
  ? ValidatorFn<TValue, TFormState> | ValidatorFn<TValue, TFormState>[]
  : TValue extends Array<infer E>
    ? ValidatorConfig<E, TFormState>
    : TValue extends object
      ? { [K in keyof TValue & string]?: ValidatorConfig<TValue[K], TFormState> }
      : never;

import { NgrxSignalFormArray, NgrxSignalFormControl, NgrxSignalFormGroup } from './ngrx-signal-form.types';

export interface TypeWrapper<T> {
  t: T;
}

export type DeducedStringNgrxSignalFormControl<T extends TypeWrapper<unknown>> =
  T extends TypeWrapper<string>
  ? NgrxSignalFormControl<string>
  : T extends TypeWrapper<string | undefined>
    ? NgrxSignalFormControl<string | undefined>
    : T extends TypeWrapper<string | null>
      ? NgrxSignalFormControl<string | null>
      : T extends TypeWrapper<string | undefined | null>
        ? NgrxSignalFormControl<string | undefined | null>
        : never;

export type DeducedNumberNgrxSignalFormControl<T extends TypeWrapper<unknown>> =
  T extends TypeWrapper<number>
  ? NgrxSignalFormControl<number>
  : T extends TypeWrapper<number | undefined>
    ? NgrxSignalFormControl<number | undefined>
    : T extends TypeWrapper<number | null>
      ? NgrxSignalFormControl<number | null>
      : T extends TypeWrapper<number | undefined | null>
        ? NgrxSignalFormControl<number | undefined | null>
        : never;

export type DeducedBooleanNgrxSignalFormControl<T extends TypeWrapper<unknown>> =
  T extends TypeWrapper<boolean>
  ? NgrxSignalFormControl<boolean>
  : T extends TypeWrapper<boolean | undefined>
    ? NgrxSignalFormControl<boolean | undefined>
    : T extends TypeWrapper<boolean | null>
      ? NgrxSignalFormControl<boolean | null>
      : T extends TypeWrapper<boolean | undefined | null>
        ? NgrxSignalFormControl<boolean | undefined | null>
        : never;

export type DeducedNgrxSignalFormState<T extends TypeWrapper<unknown>> =
  T extends TypeWrapper<symbol>
  ? NgrxSignalFormControl<undefined>
  : T extends TypeWrapper<undefined>
    ? NgrxSignalFormControl<undefined>
    : T extends TypeWrapper<null>
      ? NgrxSignalFormControl<null>

      // form control
      : T extends TypeWrapper<string | undefined | null>
        ? DeducedStringNgrxSignalFormControl<T>
        : T extends TypeWrapper<number | undefined | null>
          ? DeducedNumberNgrxSignalFormControl<T>
          : T extends TypeWrapper<boolean | undefined | null>
            ? DeducedBooleanNgrxSignalFormControl<T>

            // form array
            : T extends TypeWrapper<readonly (infer U)[] | undefined | null>
              ? NgrxSignalFormArray<U>

              // form group
              : T extends TypeWrapper<infer U | undefined | null>
                ? U extends object
                  ? NgrxSignalFormGroup<U>
                  : never

                // not recognized form type
                : never;

export type NgrxSignalFormState<T> = DeducedNgrxSignalFormState<TypeWrapper<T>>;

import { Signal }                          from '@angular/core';
import {
  NgrxControlValue,
  NgrxSignalFormState,
  NgrxSignalFormStoreFeatureMethods,
  updateRecursive
}                                          from '@ngrx-signal-forms';
import {
  patchState,
  SignalStoreFeature,
  signalStoreFeature,
  type,
  withHooks,
  withMethods
}                                          from '@ngrx/signals';
import {
  rxMethod
}                                          from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, tap } from 'rxjs';
import {
  ValidatorConfig
}                                          from './types/ngrx-signal-form-validation.types';
import {
  validate
}                                          from './updaters/control-updaters/validate.updater';
import {
  normalizeValidators
}                                          from './utils/ngrx-signal-form-validation.utils';

export type NgrxSignalFormValidationFeatureMethods = {
  validate(): void;
}

// TODO is possible to infer TFormValue, so formValue doesnt need to be explicitly provided?

export function withNgrxSignalFormValidation<
  TFormName extends string,
  TFormValue
>(config: {
  formName: TFormName,
  initialFormValue: TFormValue,
  validators?: ValidatorConfig<TFormValue>,
  softValidators?: ValidatorConfig<TFormValue>
}): SignalStoreFeature<
  {
    state: { formState: NgrxSignalFormState<TFormValue> },
    signals: { formValue: Signal<TFormValue> },
    methods: NgrxSignalFormStoreFeatureMethods
  },
  {
    state: {}, // eslint-disable-line @typescript-eslint/ban-types
    signals: {}, // eslint-disable-line @typescript-eslint/ban-types
    methods: NgrxSignalFormValidationFeatureMethods
  }
>;

export function withNgrxSignalFormValidation<
  TFormName extends string,
  TFormValue
>(config: {
  formName: TFormName,
  initialFormValue: TFormValue,
  validators?: ValidatorConfig<TFormValue>,
  softValidators?: ValidatorConfig<TFormValue>
}) {

  const { formName, validators, softValidators } = config;
  const normalizedValidators = normalizeValidators(formName, validators);
  const normalizedSoftValidators = normalizeValidators(formName, softValidators);

  return signalStoreFeature(
    {
      state: type<{ formState: NgrxSignalFormState<TFormValue> }>(),
      signals: type<{ formValue: Signal<TFormValue> }>(),
      methods: type<NgrxSignalFormStoreFeatureMethods>()
    },
    withMethods(store => {

      return {
        validate: () => {
          if (!normalizedValidators || !normalizedSoftValidators) {
            return;
          }

          const formState = store.formState();
          const validationFn = validate(formState, normalizedValidators, normalizedSoftValidators);
          const updatedFormState = updateRecursive(formState, validationFn);

          if (formState !== updatedFormState) {
            patchState(store, { formState: updatedFormState });
          }
        }
      };
    }),

    withMethods(store => {
      return {
        validateOnValueChange: rxMethod<NgrxControlValue>(
          pipe(
            distinctUntilChanged(),
            tap(() => store.validate())
          ))
      };
    }),

    withHooks({
      onInit({ validateOnValueChange, formValue }) {
        validateOnValueChange(formValue);
      }
    })
  );
}

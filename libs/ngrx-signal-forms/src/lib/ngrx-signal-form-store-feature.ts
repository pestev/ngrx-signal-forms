import { computed, Signal } from '@angular/core';
import {
  patchState,
  SignalStoreFeature,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState
}                           from '@ngrx/signals';
import {
  NgrxSignalFormState
}                           from './types/ngrx-signal-form-deduced.types';
import {
  NgrxControlValue
}                           from './types/ngrx-signal-form.types';
import {
  markAsDirty
}                           from './updaters/control-updaters/mark-as-dirty.updater';
import {
  markAsDisabled
}                           from './updaters/control-updaters/mark-as-disabled.updater';
import {
  markAsEnabled
}                           from './updaters/control-updaters/mark-as-enabled.updater';
import {
  markAsTouched
}                           from './updaters/control-updaters/mark-as-touched.updater';
import {
  markAsUntouched
}                           from './updaters/control-updaters/mark-as-untouched.updater';
import {
  setErrors
}                           from './updaters/control-updaters/set-errors.updater';
import {
  setValue
}                           from './updaters/control-updaters/set-value.updater';
import {
  setWarnings
}                           from './updaters/control-updaters/set-warnings.updater';
import {
  validate
}                           from './updaters/control-updaters/validate.updater';
import {
  updateRecursive,
  updatersPipe
}                           from './updaters/ngrx-signal-form-control.updater';
import {
  ngrxSignalFormStateUpdater
}                           from './updaters/ngrx-signal-form-state.updater';
import {
  creator
}                           from './utils/ngrx-signal-form-create.utils';
import {
  ValidatorConfig,
  ValidatorFn
}                           from './validation/ngrx-signal-form-validation.types';
import {
  required
}                           from './validation/validators/required.validator';

export type NgrxSignalFormStoreFeatureMethods = {
  updateValue(controlId: string, value: NgrxControlValue): void;
  updateTouched(controlId: string, isTouched: boolean): void;
  updateDisabled(controlId: string, isDisabled: boolean): void;
  updateErrors(controlId: string, errors: Record<string, unknown>): void;
  updateWarnings(controlId: string, warnings: Record<string, unknown>): void;
  validate(): void;
}

export type NgrxSignalFormFeatureState<
  TFormName extends string,
  TFormValue extends NgrxControlValue
> = { [K in TFormName as `${ K }`]: NgrxSignalFormState<TFormValue> };

/**
 * Creates a SignalStoreFeature with NgrxSignalForm.
 * Function overload for type safety, so consuming store will correctly recognize, what this feature add to the store
 *
 * @param config - The configuration for creating the SignalStoreFeature.
 * @param config.formName - The name of the form.
 * @param config.state - The initial state of the form.
 *
 * @return A SignalStoreFeature that includes the state, signals, and methods for the form.
 */
export function withNgrxSignalForm<
  TFormName extends string,
  TFormValue extends NgrxControlValue
>(config: {
  formName: TFormName,
  formValue: TFormValue,
  validators?: ValidatorConfig<TFormValue>
}): SignalStoreFeature<
  {
    state: object,
    signals: {}, // eslint-disable-line @typescript-eslint/ban-types
    methods: {} // eslint-disable-line @typescript-eslint/ban-types
  },
  {
    state: NgrxSignalFormFeatureState<TFormName, TFormValue>,
    signals: {
      formValueAsJSON: Signal<string>,
      formValueAsFormattedJSON: Signal<string>,
    },
    methods: NgrxSignalFormStoreFeatureMethods & {
      reset(v: TFormValue): void;
    }
  }
>;

/**
 * Creates a SignalStoreFeature for a form using NgrxSignalForm.
 *
 * @param {object} config - Configuration options.
 * @param {string} config.formName - The name of the form.
 * @param {object} config.state - The initial state for the form.
 * @return {SignalStoreFeature} - The SignalStoreFeature for the form.
 */
export function withNgrxSignalForm<
  TFormName extends string,
  TFormValue
>(config: {
  formName: TFormName,
  formValue: TFormValue,
  validators?: ValidatorConfig<TFormValue>,
  softValidators?: ValidatorConfig<TFormValue>
}): SignalStoreFeature {

  const { formName, formValue } = config;
  const formState = creator(formName, formValue);

  // TODO this is mock, make normalization function which take config.validators and transform into below type
  const normalizedValidators: Record<string, ValidatorFn> = {
    [`${ formName }.name`]: required,
    [`${ formName }.address.city`]: required,
    [`${ formName }.items.itemName`]: required
  };

  // TODO this is mock, make normalization function which take config.softValidators and transform into below type
  const normalizedSoftValidators: Record<string, ValidatorFn> = {};

  return signalStoreFeature(
    withState({ [formName]: formState }),

    withComputed(store => {
      const formSignal =
        (store as Record<string, Signal<unknown>>)[formName] as Signal<NgrxSignalFormState<TFormValue>>;

      return {
        formValueAsJSON: computed(() => JSON.stringify(formSignal(), null, 4)),

        formValueAsFormattedJSON: computed(() => JSON.stringify(formSignal(), null, 4))
      };
    }),

    withMethods(store => {
      const formSignal =
        (store as Record<string, Signal<unknown>>)[formName] as Signal<NgrxSignalFormState<TFormValue>>;

      return {
        reset: (value: TFormValue): void => {
          patchState(store, { [formName]: creator(formName, value) });
        },

        // TODO try to type value, based on controlId
        updateValue: (controlId: string, value: unknown): void => {
          const formState = formSignal();
          const updater = updatersPipe(setValue(value), markAsDirty);
          const updatedFormState =
            ngrxSignalFormStateUpdater(formState, controlId, updater);

          if (formState !== updatedFormState) {
            patchState(store, { [formName]: updatedFormState });
          }
        },

        updateTouched: (controlId: string, isTouched: boolean): void => {
          const formState = formSignal();
          const updater = isTouched ? markAsTouched : markAsUntouched;
          const updatedFormState =
            ngrxSignalFormStateUpdater(formState, controlId, updater);

          if (formState !== updatedFormState) {
            patchState(store, { [formName]: updatedFormState });
          }
        },

        updateDisabled: (controlId: string, isDisabled: boolean): void => {
          const formState = formSignal();
          const updater = isDisabled ? markAsDisabled : markAsEnabled;
          const updatedFormState =
            ngrxSignalFormStateUpdater(formState, controlId, updater);

          if (formState !== updatedFormState) {
            patchState(store, { [formName]: updatedFormState });
          }
        },

        updateErrors: (controlId: string, errors: Record<string, unknown>): void => {
          const formState = formSignal();
          const updater = setErrors(errors);
          const updatedFormState =
            ngrxSignalFormStateUpdater(formState, controlId, updater);

          if (formState !== updatedFormState) {
            patchState(store, { [formName]: updatedFormState });
          }
        },

        updateWarnings: (controlId: string, warnings: Record<string, unknown>): void => {
          const formState = formSignal();
          const updater = setWarnings(warnings);
          const updatedFormState =
            ngrxSignalFormStateUpdater(formState, controlId, updater);

          if (formState !== updatedFormState) {
            patchState(store, { [formName]: updatedFormState });
          }
        },

        validate: () => {
          if (!config.validators) {
            return;
          }

          const formState = formSignal();
          const validation = validate(formState, normalizedValidators, normalizedSoftValidators);
          const updatedFormState = updateRecursive(formState, validation);

          if (formState !== updatedFormState) {
            patchState(store, { [formName]: updatedFormState });
          }
        }
      };

    })
  );
}

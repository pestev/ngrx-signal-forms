import { computed, inject, ProviderToken, Signal, untracked }                               from '@angular/core';
import {
  BaseControl,
  getCorrectControlState,
  isEmpty,
  isFormArrayControl,
  iterableFormStateSignal,
  NgrxControlValue,
  NgrxSignalFormState,
  NgrxSignalFormStoreFeatureMethods,
  ngrxSignalFormUpdater
}                                                                                           from '@ngrx-signal-forms-test';
import { tapResponse }                                                                      from '@ngrx/operators';
import { patchState, SignalStoreFeature, signalStoreFeature, type, withHooks, withMethods } from '@ngrx/signals';
import {
  rxMethod
}                                                                                           from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, groupBy, mergeMap, pipe, switchMap, tap }                    from 'rxjs';
import {
  AsyncValidatorConfig,
  AsyncValidatorFn
}                                                                                           from './types/ngrx-signal-form-async-validation.types';
import {
  ValidatorConfig
}                                                                                           from './types/ngrx-signal-form-validation.types';
import {
  validate
}                                                                                           from './updaters/control-updaters/validate.updater';
import {
  normalizeAsyncValidators,
  normalizeValidators
}                                                                                           from './utils/ngrx-signal-form-validation.utils';

export type NgrxSignalFormValidationFeatureMethods = {
  validate(): void;
}

export type AsyncService<T> = T extends ProviderToken<infer U> ? U : never;

// TODO is possible to infer TFormValue, so formValue doesnt need to be explicitly provided?

export function withNgrxSignalFormValidation<
  TFormName extends string,
  TFormValue,
  TAsyncServiceToken extends ProviderToken<unknown>,
  TAsyncService extends AsyncService<TAsyncServiceToken>
>(config: {
  formName: TFormName,
  initialFormValue: TFormValue,
  validators?: ValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  softValidators?: ValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  asyncServiceToken?: TAsyncServiceToken,
  asyncValidators?: (service: TAsyncService) => AsyncValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  asyncSoftValidators?: (service: TAsyncService) => AsyncValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
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
  TFormValue,
  TAsyncServiceToken extends ProviderToken<unknown>,
  TAsyncService extends AsyncService<TAsyncServiceToken>
>(config: {
  formName: TFormName,
  initialFormValue: TFormValue,
  validators?: ValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  softValidators?: ValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  asyncServiceToken?: TAsyncServiceToken,
  asyncValidators?: (service: TAsyncService) => AsyncValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  asyncSoftValidators?: (service: TAsyncService) => AsyncValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>
}) {

  const { formName } = config;
  const normalizedValidators = normalizeValidators(formName, config.validators);
  const normalizedSoftValidators = normalizeValidators(formName, config.softValidators);

  return signalStoreFeature(
    {
      state: type<{ formState: NgrxSignalFormState<TFormValue> }>(),
      signals: type<{ formValue: Signal<TFormValue> }>(),
      methods: type<NgrxSignalFormStoreFeatureMethods>()
    },

    withMethods(store => {

      return {
        validate: () => {
          if (isEmpty(normalizedValidators) && isEmpty(normalizedSoftValidators)) {
            return;
          }

          const formState = store.formState();
          const validationFn = validate(formState, normalizedValidators, normalizedSoftValidators);
          const updatedFormState = ngrxSignalFormUpdater(formState, validationFn);

          if (formState !== updatedFormState) {
            patchState(store, { formState: updatedFormState });
          }
        },

        asyncValidateErrorsControlFactory: (
          controlId: string,
          vId: string,
          fn: AsyncValidatorFn<NgrxSignalFormState<TFormValue>>
        ) => {

          return rxMethod<{
            formValue: TFormValue,
            controlState: BaseControl,
            formState: NgrxSignalFormState<TFormValue>
          }>(pipe(
            switchMap(getCorrectControlState(controlId, vId)),
            groupBy(c => c.controlState.id),
            mergeMap(g => g.pipe(
              tap(({ controlState }) => store.updateIsValidating(controlState.id, true)),
              fn,
              tapResponse(
                ({ id, errors }) => {
                  store.updateIsValidating(id, false);
                  store.updateAsyncErrors(id, errors);
                },
                ({ id }) => {
                  store.updateIsValidating(id, false);
                }
              )
            ))
          ));
        },

        asyncValidateWarningsControlFactory: (
          controlId: string,
          vId: string,
          fn: AsyncValidatorFn<NgrxSignalFormState<TFormValue>>
        ) => {

          return rxMethod<{
            formValue: TFormValue,
            controlState: BaseControl,
            formState: NgrxSignalFormState<TFormValue>
          }>(pipe(
            switchMap(getCorrectControlState(controlId, vId)),
            groupBy(c => c.controlState.id),
            mergeMap(g => g.pipe(
              tap(({ controlState }) => store.updateIsValidating(controlState.id, true)),
              fn,
              tapResponse(
                ({ id, errors }) => {
                  store.updateIsValidating(id, false);
                  store.updateAsyncWarnings(id, errors);
                },
                ({ id }) => {
                  store.updateIsValidating(id, false);
                }
              )
            ))
          ));
        }

      };
    }),

    withMethods((
      store,
      asyncService = config.asyncServiceToken ? inject(config.asyncServiceToken) : null
    ) => {

      return {
        validateOnValueChange: rxMethod<NgrxControlValue>(
          pipe(
            distinctUntilChanged(),
            tap(() => store.validate())
          )
        ),

        registerAsyncValidation: () => {

          const normalizedAsyncValidators = normalizeAsyncValidators(formName, config.asyncValidators?.(asyncService));
          const normalizedAsyncSoftValidators = normalizeAsyncValidators(formName, config.asyncSoftValidators?.(asyncService));

          for (const controlStateSignal of iterableFormStateSignal(store.formState)) {
            const controlState = controlStateSignal();

            const validatorsKeys = findValidatorKey(controlState, normalizedAsyncValidators);
            const softValidatorsKeys = findValidatorKey(controlState, normalizedAsyncSoftValidators);

            if (validatorsKeys || softValidatorsKeys) {

              const payload = computed(() => ({
                formValue: store.formValue(),
                controlState: untracked(controlStateSignal),
                formState: untracked(store.formState)
              }));

              if (validatorsKeys) {

                validatorsKeys.forEach(validatorKey => {
                  const generatedValidationRxFunction =
                    store.asyncValidateErrorsControlFactory(
                      controlState.id,
                      validatorKey,
                      normalizedAsyncValidators[validatorKey]
                    );

                  generatedValidationRxFunction(payload);
                });
              }

              if (softValidatorsKeys) {

                softValidatorsKeys.forEach(softValidatorKey => {
                  const generatedValidationRxFunction =
                    store.asyncValidateWarningsControlFactory(
                      controlState.id,
                      softValidatorKey,
                      normalizedAsyncSoftValidators[softValidatorKey]
                    );

                  generatedValidationRxFunction(payload);
                });
              }

            }
          }
        }

      };
    }),

    withHooks({
      onInit(store) {
        store.validateOnValueChange(store.formValue);
        store.registerAsyncValidation();
      }
    })
  );
}


function findValidatorKey<TFormValue>(
  controlState: BaseControl,
  validators: Record<string, AsyncValidatorFn<NgrxSignalFormState<TFormValue>>>
): string[] | null {

  if (Object.hasOwn(validators, controlState.vId)) {
    // console.debug('able - has own');
    return [ controlState.vId ];
  }

  if (isFormArrayControl(controlState)) {
    const keys = Object.keys(validators);
    const validatorsKeys = keys.filter((key) => key.startsWith(controlState.vId));
    // console.debug('able - array: ', controlState.id, validatorsKeys);
    return validatorsKeys || null;
  }

  // console.debug('unable');

  return null;
}

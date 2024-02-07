import { computed, inject, ProviderToken, Signal, untracked }                               from '@angular/core';
import {
  BaseControl,
  isEmpty,
  iterableFormStateSignal,
  NgrxControlValue,
  NgrxSignalFormState,
  NgrxSignalFormStoreFeatureMethods,
  updateRecursive
}                                                                                           from '@ngrx-signal-forms-test';
import { tapResponse }                                                                      from '@ngrx/operators';
import { patchState, SignalStoreFeature, signalStoreFeature, type, withHooks, withMethods } from '@ngrx/signals';
import {
  rxMethod
}                                                                                           from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, pipe, tap }                                                  from 'rxjs';
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
  applyAsyncValidatorFn,
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
          const updatedFormState = updateRecursive(formState, validationFn);

          if (formState !== updatedFormState) {
            patchState(store, { formState: updatedFormState });
          }
        },

        asyncValidateErrorsControlFactory: (
          controlStateId: string,
          fn: AsyncValidatorFn<NgrxSignalFormState<TFormValue>>
        ) => {

          return rxMethod<{
            formValue: TFormValue,
            controlState: BaseControl,
            formState: NgrxSignalFormState<TFormValue>
          }>(pipe(
            tap(({ controlState }) => store.updateIsValidating(controlStateId, true)),
            fn,
            tapResponse(
              validationResult => {
                console.debug('validation result: ', controlStateId, validationResult);
                store.updateIsValidating(controlStateId, false);
                store.updateAsyncErrors(controlStateId, validationResult, true);
              },
              e => {
                console.debug('validation error: ', controlStateId, e);
                store.updateIsValidating(controlStateId, false);
              }
            )
          ));
        },

        asyncValidateErrorsControl: rxMethod<{
          formValue: TFormValue,
          controlState: BaseControl,
          formState: NgrxSignalFormState<TFormValue>,
          fn: AsyncValidatorFn<NgrxSignalFormState<TFormValue>>
        }>(pipe(
          tap(({ controlState }) => store.updateIsValidating(controlState.id, true)),

          applyAsyncValidatorFn

          // switchMap(({ controlState, formState, fn }) => of({ controlState, formState }).pipe(
          //   tap(a => console.debug('test 1: ', a)),
          //   fn,
          //   tap(a => console.debug('test 2: ', a))
          // ))

          // switchMap(({ controlState, fn }) => fn.pipe(
          //     tapResponse(
          //       (validationResult) => {
          //         store.updateIsValidating(controlState.id, false);
          //         store.updateErrors(controlState.id, validationResult, true);
          //       },
          //       () => {
          //         store.updateIsValidating(controlState.id, false);
          //       }
          //     )
          //   )
          // )
        )),

        asyncValidateWarningsControl: rxMethod<{
          formValue: TFormValue,
          controlState: BaseControl,
          formState: NgrxSignalFormState<TFormValue>,
          fn: AsyncValidatorFn<NgrxSignalFormState<TFormValue>>
        }>(pipe(
          // map(({ controlState, formState, fns }) => ({
          //   controlState,
          //   fn: merge(
          //     fns.map(f => f(of({ controlState, formState })))
          //   )
          // })),
          // tap(a => console.debug('async: ', a)),
          // tap(({ controlState }) => store.updateIsValidating(controlState.id, true)),
          // switchMap(({ controlState, fn }) => fn.pipe(
          //     tapResponse(
          //       (validationResult) => {
          //         store.updateIsValidating(controlState.id, false);
          //         store.updateWarnings(controlState.id, validationResult, true);
          //       },
          //       () => {
          //         store.updateIsValidating(controlState.id, false);
          //       }
          //     )
          //   )
          // )
        ))

        // asyncValidateWarningsControl: rxMethod<{
        //   controlState: NgrxSignalFormState<NgrxControlValue>;
        //   formState: NgrxSignalFormState<TFormValue>,
        //   fn: AsyncValidatorFn<NgrxControlValue, NgrxSignalFormState<TFormValue>>[]
        // }>(pipe(
        //   // tap(a => console.debug(a)),
        //   tap(({ controlState }) => store.updateIsValidating(controlState.id, true)),
        //   switchMap(({ controlState, formState, fn }) => fn(controlState, formState).pipe(
        //     tapResponse({
        //       next: validationResult => {
        //         store.updateWarnings(controlState.id, validationResult, true);
        //       },
        //       error: () => {
        //       }
        //     })
        //   ))
        // ))

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

            if (Object.hasOwn(normalizedAsyncValidators, controlState.id)) {
              // const payload = computed(() => {
              //   return {
              //     formValue: store.formValue(),
              //     controlState: untracked(controlStateSignal),
              //     formState: untracked(store.formState),
              //     fn: normalizedAsyncValidators[controlState.id]
              //   };
              // });
              //
              // store.asyncValidateErrorsControl(payload);
              const payload = computed(() => {
                return {
                  formValue: store.formValue(),
                  controlState: untracked(controlStateSignal),
                  formState: untracked(store.formState)
                };
              });

              const generatedValidationRxFunction =
                store.asyncValidateErrorsControlFactory(
                  controlStateSignal().id,
                  normalizedAsyncValidators[controlState.id]
                );

              generatedValidationRxFunction(payload);
            }

            if (Object.hasOwn(normalizedAsyncSoftValidators, controlState.id)) {
              const payload = computed(() => {
                return {
                  formValue: store.formValue(),
                  controlState: untracked(controlStateSignal),
                  formState: untracked(store.formState),
                  fn: normalizedAsyncSoftValidators[controlState.id]
                };
              });

              store.asyncValidateWarningsControl(payload);
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

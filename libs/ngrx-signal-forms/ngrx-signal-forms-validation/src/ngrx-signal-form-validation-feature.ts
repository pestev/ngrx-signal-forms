import { inject, Injector, Signal } from '@angular/core';
import {
  isEmpty,
  NgrxControlValue,
  NgrxSignalFormState,
  NgrxSignalFormStoreFeatureMethods,
  updateRecursive
}                                   from '@ngrx-signal-forms';
import {
  tapResponse
}                                   from '@ngrx/operators';
import {
  patchState,
  SignalStoreFeature,
  signalStoreFeature,
  type,
  withHooks,
  withMethods
}                                   from '@ngrx/signals';
import {
  rxMethod
}                                   from '@ngrx/signals/rxjs-interop';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  pipe,
  switchMap,
  tap
}                                   from 'rxjs';
import {
  AsyncValidatorConfig,
  AsyncValidatorFn
}                                   from './types/ngrx-signal-form-async-validation.types';
import {
  ValidatorConfig
}                                   from './types/ngrx-signal-form-validation.types';
import {
  validate
}                                   from './updaters/control-updaters/validate.updater';
import {
  normalizeValidators
}                                   from './utils/ngrx-signal-form-validation.utils';

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
  validators?: ValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  softValidators?: ValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  asyncValidators?: AsyncValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  asyncSoftValidators?: AsyncValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>
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
  validators?: ValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  softValidators?: ValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  asyncValidators?: AsyncValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>,
  asyncSoftValidators?: AsyncValidatorConfig<TFormValue, NgrxSignalFormState<TFormValue>>
}) {

  const { formName } = config;
  const normalizedValidators = normalizeValidators(formName, config.validators);
  const normalizedSoftValidators = normalizeValidators(formName, config.softValidators);
  const normalizedAsyncValidators = normalizeValidators(formName, config.asyncValidators);
  const normalizedAsyncSoftValidators = normalizeValidators(formName, config.asyncSoftValidators);

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

        asyncValidateErrorsControl: rxMethod<{
          controlState: NgrxSignalFormState<NgrxControlValue>;
          formState: NgrxSignalFormState<TFormValue>,
          fns: AsyncValidatorFn<NgrxControlValue, NgrxSignalFormState<TFormValue>>[]
        }>(pipe(
          distinctUntilChanged(
            (prev, curr) => prev === curr,
            c => c.formState.value
          ),
          tap(a => console.debug('async validation config: ', a)),
          map(({ controlState, formState, fns }) => ({
            controlState,
            fn: combineLatest(
              fns.map(f => f(controlState, formState)),
              (...results) => results.reduce(
                (rr, r) => Object.assign(rr, r),
                {}
              )
            )
          })),
          tap(({ controlState }) => store.updateIsValidating(controlState.id, true)),
          switchMap(({ controlState, fn }) => fn.pipe(
              tapResponse(
                (validationResult) => {
                  console.debug('async validation result: ', controlState.id, validationResult);
                  store.updateIsValidating(controlState.id, false);
                  store.updateErrors(controlState.id, validationResult, true);
                },
                () => {
                  store.updateIsValidating(controlState.id, false);
                }
              )
            )
          )
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

    withMethods((store) => {

      return {
        validateOnValueChange: rxMethod<NgrxControlValue>(
          pipe(
            distinctUntilChanged(),
            tap(() => store.validate())
          )
        ),

        registerAsyncValidationErrors: (injector = inject(Injector)) => {
          //
          // const formState = store.formState();
          //
          // updateRecursive(formState, (controlState) => {
          //   if (Object.hasOwn(normalizedAsyncValidators, controlState.id)) {
          //     const payload$ = toObservable(store.formState, { injector }).pipe(
          //       map(formState => ({
          //         controlState: controlState as NgrxSignalFormState<NgrxControlValue>,
          //         formState,
          //         fns: normalizedAsyncValidators[controlState.id]
          //       }))
          //     );
          //
          //     store.asyncValidateErrorsControl(payload$);
          //   }
          //
          //   return controlState;
          // });
        }

        // registerAsyncValidationWarnings: (store) => {
        //
        //   const formState = store.formState();
        //
        //   updateRecursive(formState, (control) => {
        //     if (Object.hasOwn(normalizedAsyncSoftValidators, control.id)) {
        //       store.asyncValidateWarningsControl({
        //         controlState: control,
        //         formState,
        //         fn: normalizedAsyncSoftValidators[control.id]
        //       });
        //     }
        //
        //     return control;
        //   });
        // }

      };
    }),

    withHooks({
      onInit(store) {
        store.validateOnValueChange(store.formValue);
        store.registerAsyncValidationErrors();
        // store.registerAsyncValidationWarnings(store);
      }
    })
  );
}

//
// function* testIterator<TValue>(state: DeepSignal<unknown>): Generator<DeepSignal<unknown>> {
//
//   if (isFormGroupControlSignal<TValue & object>(state)) {
//     console.debug('test is form object');
//
//     const controls = state.controls as DeepSignal<NgrxSignalFormGroupControls<TValue & object>>;
//
//     for (const key of Object.keys(state.controls())) {
//       const control = controls[key as keyof typeof controls];
//       yield* testIterator(control as DeepSignal<unknown>);
//     }
//
//     yield state;
//   }
//
//   if (isFormArrayControlSignal(state)) {
//     console.debug('test is form array');
//
//     const controls = state.controls as DeepSignal<NgrxSignalFormState<TValue>[]>;
//
//     for (const key of state.controls().keys()) {
//       // This can not work since ngrx DeepSignal doesnt provide deep signal for array values :(
//       const control = controls[key];
//       yield* testIterator(control);
//     }
//
//     yield state;
//   }
//
//   if (isFormControl(state)) {
//     console.debug('test is form control');
//     yield state;
//   }
//
// }

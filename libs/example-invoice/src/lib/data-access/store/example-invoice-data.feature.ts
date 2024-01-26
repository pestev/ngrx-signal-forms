import { inject, Signal }                                                from '@angular/core';
import {
  NgrxSignalFormStoreFeatureMethods,
  resetFormUpdater
}                                                                        from '@ngrx-signal-forms';
import {
  tapResponse
}                                                                        from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  SignalStoreFeature,
  type,
  withHooks,
  withMethods,
  withState
}                                                                        from '@ngrx/signals';
import {
  rxMethod
}                                                                        from '@ngrx/signals/rxjs-interop';
import { filter, map, Observable, pipe, switchMap, tap, Unsubscribable } from 'rxjs';
import {
  ExampleInvoice
}                                                                        from '../../types/example.types';
import {
  ExampleInvoiceApiService
}                                                                        from '../api/example-invoice-api.service';

interface ExampleInvoiceState<TValue> {
  initialValue: TValue;
  currentId: number;
  isLoading: boolean;
  isSaving: boolean;
  apiError: string | null;
}

export function withExampleData<TFormName extends string, TValue>(
  config: {
    formName: TFormName
    initialValue: TValue
  }
): SignalStoreFeature<
  {
    state: {}, // eslint-disable-line @typescript-eslint/ban-types
    signals: { formValue: Signal<TValue> },
    methods: NgrxSignalFormStoreFeatureMethods & {
      reset(formValue?: TValue): void;
    }
  },
  {
    state: ExampleInvoiceState<TValue>,
    signals: {}, // eslint-disable-line @typescript-eslint/ban-types
    methods: {
      reset: (formValue?: TValue) => void;
      setCurrentId: (id: number) => void;
      load: (id: number | Observable<number> | Signal<number>) => Unsubscribable,
      submit: () => Unsubscribable,
    }
  }
>;

export function withExampleData<TFormName extends string, TValue extends ExampleInvoice>(
  config: {
    formName: TFormName
    initialValue: TValue
  }
) {

  return signalStoreFeature(
    {
      signals: type<{ formValue: Signal<TValue> }>(),
      methods: type<NgrxSignalFormStoreFeatureMethods & {
        reset(formValue?: TValue): void;
      }>()
    },

    withState<ExampleInvoiceState<TValue>>({
      initialValue: config.initialValue,
      currentId: 0,
      isLoading: false,
      isSaving: false,
      apiError: null
    }),

    withMethods((
      store,
      apiService = inject(ExampleInvoiceApiService)
    ) => {

      return {

        reset(formValue?: TValue): void {
          const v = formValue ?? store.initialValue();
          store.reset(v);
          patchState(store, { isLoading: false, apiError: null, currentId: v.id });
        },

        setCurrentId: (id: number) => {
          patchState(store, { currentId: id });
        },

        load: rxMethod<number>(pipe(
          filter(Boolean),
          tap(() => patchState(store, { isLoading: true, apiError: null })),
          switchMap(id => apiService.load(id).pipe(
            tapResponse({
              next: result => patchState(store, {
                isLoading: false,
                apiError: null,
                initialValue: result as TValue,
                ...resetFormUpdater(config.formName, result)
              }),
              error: e => patchState(store, {
                isLoading: false,
                apiError: `${ e }`,
                ...resetFormUpdater(config.formName, config.initialValue)
              })
            })
          ))
        )),

        submit: rxMethod<void>(pipe(
          tap(() => patchState(store, { isSaving: true, apiError: null })),
          map(() => store.formValue()),
          switchMap(invoice => apiService.save(invoice).pipe(
            tapResponse({
              next: result => patchState(store, {
                isSaving: false,
                apiError: null,
                ...resetFormUpdater(config.formName, result)
              }),
              error: e => patchState(store, {
                isLoading: false,
                apiError: `${ e }`
              })
            })
          ))
        ))
      };
    }),

    withHooks({
      onInit: ({ load, currentId }) => {
        load(currentId);
      }
    })
  );
}

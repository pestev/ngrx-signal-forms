import { inject }                       from '@angular/core';
import {
  NgrxSignalFormStoreFeatureMethods,
  resetFormUpdater
}                                       from '@ngrx-signal-forms';
import {
  tapResponse
}                                       from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  SignalStoreFeature,
  type,
  withHooks,
  withMethods,
  withState
}                                       from '@ngrx/signals';
import {
  rxMethod
}                                       from '@ngrx/signals/rxjs-interop';
import { filter, pipe, switchMap, tap } from 'rxjs';
import {
  ExampleInvoice
}                                       from '../../types/example.types';
import {
  ExampleInvoiceApiService
}                                       from '../api/example-invoice-api.service';

interface ExampleInvoicePartialState<TValue> {
  initialValue: TValue;
  currentId: number;
  isLoading: boolean;
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
    signals: {}, // eslint-disable-line @typescript-eslint/ban-types
    methods: NgrxSignalFormStoreFeatureMethods & {
      reset(formValue?: TValue): void;
    }
  },
  {
    state: ExampleInvoicePartialState<TValue>,
    signals: {}, // eslint-disable-line @typescript-eslint/ban-types
    methods: {
      setCurrentId: (id: number) => void
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
      methods: type<NgrxSignalFormStoreFeatureMethods & {
        reset(formValue?: TValue): void;
      }>()
    },

    withState<ExampleInvoicePartialState<TValue>>({
      initialValue: config.initialValue,
      currentId: 0,
      isLoading: false,
      apiError: null
    }),

    withMethods((
      store,
      apiService = inject(ExampleInvoiceApiService)
    ) => {

      return {

        reset(formValue?: TValue): void {
          store.reset(formValue);
          patchState(store, { isLoading: false, apiError: null, currentId: config.initialValue.id });
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
              }),
              finalize: () => patchState(store, { isLoading: false })
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

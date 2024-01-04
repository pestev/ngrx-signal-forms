import { SignalStoreFeature, signalStoreFeature, withState } from '@ngrx/signals';
import { NgrxSignalForm }                                    from './types/ngrx-signal-forms.types';
import { generate }                                          from './utils/ngrx-signal-forms-generator';

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
  TFormValue
>(config: {
  formName: TFormName,
  formValue: TFormValue
}): SignalStoreFeature<
  {
    state: object,
    signals: {}, // eslint-disable-line @typescript-eslint/ban-types
    methods: {} // eslint-disable-line @typescript-eslint/ban-types
  },
  {
    state: NgrxSignalForm<TFormName, TFormValue>,
    signals: {}, // eslint-disable-line @typescript-eslint/ban-types
    methods: {
      reset(v: TFormValue): void;
      updateValue(controlId: string, value: TFormValue): void;
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
  TFormValue,
>(config: {
  formName: TFormName,
  formValue: TFormValue
}): SignalStoreFeature {

  const { formName, formValue } = config;
  const formState = generate(formName, formValue);

  return signalStoreFeature(
    withState({ [formName]: formState })

    // withMethods(store => {

    // const formSignal =
    //   (store as Record<string, Signal<unknown>>)[formName] as Signal<NgrxSignalFormState<TFormValue>>;
    //
    // return {
    //   reset: (value: TFormValue): void => {
    //     patchState(store, { [formName]: creator(formName, value) });
    //   },
    //
    //   updateValue: (controlId: string, value: TFormValue): void => {
    //     const formState = formSignal();
    //     const updatedFormState = updateValueUpdater(formState, controlId, value);
    //     if (formState !== updatedFormState) {
    //       patchState(store, { [formName]: updatedFormState });
    //     }
    //   }
    // };

    // })
  );
}

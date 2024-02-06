import { Signal }                                                                  from '@angular/core';
import {
  BaseControl,
  NgrxSignalFormGroupControls
}                                                                                  from '../../types/ngrx-signal-form.types';
import { isFormArrayControlSignal, isFormControlSignal, isFormGroupControlSignal } from '../ngrx-signal-form.utils';

export function* iterableFormStateSignal<TValue>(state: Signal<BaseControl>): Generator<Signal<BaseControl>> {

  if (isFormGroupControlSignal<TValue & object>(state)) {
    const controlsSignals =
      state.controls as Record<string, Signal<NgrxSignalFormGroupControls<TValue & object>>>;

    for (const key of Object.keys(state.controls())) {
      yield* iterableFormStateSignal(controlsSignals[key] as Signal<BaseControl>);
    }

    yield state;

  } else if (isFormArrayControlSignal(state)) {
    // Is not possible to return array elements as signals, since ngrx signal store doesn't provide them as DeepSignals
    yield state;

  } else if (isFormControlSignal(state)) {
    yield state;
  }

}

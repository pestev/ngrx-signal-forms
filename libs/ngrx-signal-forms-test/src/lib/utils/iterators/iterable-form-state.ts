import { BaseControl, NgrxSignalFormGroupControls }              from '../../types/ngrx-signal-form.types';
import { isFormArrayControl, isFormControl, isFormGroupControl } from '../ngrx-signal-form.utils';

export function* iterableFormState<TValue>(state: BaseControl): Generator<BaseControl> {

  if (isFormGroupControl<TValue & object>(state)) {

    const groupControls =
      state.controls as Record<string, NgrxSignalFormGroupControls<TValue & object>>;

    for (const key of Object.keys(groupControls)) {
      yield* iterableFormState(groupControls[key] as BaseControl);
    }

    yield state;

  } else if (isFormArrayControl(state)) {

    for (const control of state.controls) {
      yield* iterableFormState(control);
    }

    yield state;

  } else if (isFormControl(state)) {
    yield state;
  }

}

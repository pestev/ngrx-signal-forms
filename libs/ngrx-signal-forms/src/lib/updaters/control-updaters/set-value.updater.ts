import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { isFormGroupControl }          from '../../utils/ngrx-signal-form.utils';
import { isObject }                    from '../../utils/utils';

export function setValue<TValue>(value: TValue): NgrxSignalFormStateUpdateFn {
  return state => {
    if (state.value === value) {
      return state;
    }

    let updatedState = Object.assign({}, state, { value });

    if (isFormGroupControl(state)) {
      if (!isObject(value)) {
        throw new Error(`Value for form group must be object! Have '${ typeof value }'`);
      }

      Object.entries(value).forEach(([ k, v ]) => {
        if (!Object.hasOwn(state.controls, k)) {
          throw new Error(`Cannot find control ${ k }. Available controls: [${ Object.keys(state.controls).join(', ') }]`);
        }

        const origChild = state.controls[k as keyof typeof state.controls];
        const updatedChild = setValue(v)(origChild);
        if (origChild !== updatedChild) {
          updatedState = Object.assign(updatedState, {
            controls: Object.assign({}, updatedState.controls, { [k]: updatedChild })
          });
        }
      });
    }

    return updatedState;
  };
}

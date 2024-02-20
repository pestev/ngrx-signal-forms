import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { isObject }                    from '../../utils/common.utils';
import { isFormGroupControl }          from '../../utils/ngrx-signal-form.utils';

export function setValue<TValue>(id: string | null, value: TValue): NgrxSignalFormStateUpdateFn {
  return state => {

    if (id && !id.startsWith(state.id)) {
      return null;
    }

    if (id && state.id !== id) {
      return state;
    }

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
        const updatedChild = setValue(null, v)(origChild);
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

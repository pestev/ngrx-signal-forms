import { BaseControl } from '../../types/ngrx-signal-form.types';
import { isObject }    from '../../utils/utils';
import { ValidatorFn } from '../ngrx-signal-form-validation.types';

export const required: ValidatorFn = (controlState: BaseControl) => {
  return isEmpty(controlState.value) ? {
    required: `${ controlState.id } must not be empty!`
  } : {};
};

function isEmpty(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return !value;
}

import { BaseControl } from '../../../src/lib/types/ngrx-signal-form.types';
import { ValidatorFn } from '../types/ngrx-signal-form-validation.types';

export const email: ValidatorFn = (controlState: BaseControl) => {
  return isEmail(controlState.value) ? {} : {
    email: `${ controlState.id } must be valid email address!`
  };
};

const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function isEmail(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  return EMAIL_REGEXP.test(value);
}

import { NgrxSignalFormStateUpdateFn } from '../../types/ngrx-signal-form.types';
import { ValidatorFn }                 from '../../validation/ngrx-signal-form-validation.types';
import { updatersPipe }                from '../ngrx-signal-form-control.updater';
import { setErrors }                   from './set-errors.updater';
import { setWarnings }                 from './set-warnings.updater';

export function validate<TFormState>(
  formState: TFormState,
  validators: Record<string, ValidatorFn>,
  softValidators: Record<string, ValidatorFn>
): NgrxSignalFormStateUpdateFn {

  return controlState => {

    let errors: Record<string, unknown> = {};
    let warnings: Record<string, unknown> = {};

    if (Object.hasOwn(validators, controlState.vId)) {
      const validatorFn = validators[controlState.vId];
      errors = validatorFn(controlState, formState);
    }

    if (Object.hasOwn(softValidators, controlState.vId)) {
      const validatorFn = softValidators[controlState.vId];
      warnings = validatorFn(controlState, formState);
    }

    return updatersPipe(
      setErrors(errors),
      setWarnings(warnings)
    )(controlState);
  };
}

import { BaseControl, NgrxSignalFormStateUpdateFn } from '../../../../src/lib/types/ngrx-signal-form.types';
import {
  setErrors
}                                                   from '../../../../src/lib/updaters/control-updaters/set-errors.updater';
import {
  setWarnings
}                                                   from '../../../../src/lib/updaters/control-updaters/set-warnings.updater';
import {
  updatersPipe
}                                                   from '../../../../src/lib/updaters/ngrx-signal-form-control.updater';
import { ValidatorFn }                              from '../../types/ngrx-signal-form-validation.types';

export function validate<TFormState>(
  formState: TFormState,
  validators: Record<string, ValidatorFn[]>,
  softValidators: Record<string, ValidatorFn[]>
): NgrxSignalFormStateUpdateFn {

  return controlState => {

    let errors: Record<string, unknown> = {};
    let warnings: Record<string, unknown> = {};

    if (Object.hasOwn(validators, controlState.vId)) {
      const validatorsFn = validators[controlState.vId];
      errors = validateFn(validatorsFn, controlState, formState);
    }

    if (Object.hasOwn(softValidators, controlState.vId)) {
      const validatorsFn = softValidators[controlState.vId];
      warnings = validateFn(validatorsFn, controlState, formState);
    }

    return updatersPipe(
      setErrors(errors),
      setWarnings(warnings)
    )(controlState);
  };
}

function validateFn<TControlState extends BaseControl, TFormState>(
  validatorsFn: ValidatorFn[],
  controlState: TControlState,
  formState: TFormState
) {

  return validatorsFn.reduce((r, vFn) => {
    return Object.assign(r, vFn(controlState, formState));
  }, {} as Record<string, unknown>);
}

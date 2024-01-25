import { NgrxSignalFormStateUpdateFn } from '../../../../src/lib/types/ngrx-signal-form.types';
import { setErrors }                   from '../../../../src/lib/updaters/control-updaters/set-errors.updater';
import { setWarnings }                 from '../../../../src/lib/updaters/control-updaters/set-warnings.updater';
import { updatersPipe }                from '../../../../src/lib/updaters/ngrx-signal-form-control.updater';
import { ValidatorFn }                 from '../../types/ngrx-signal-form-validation.types';

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

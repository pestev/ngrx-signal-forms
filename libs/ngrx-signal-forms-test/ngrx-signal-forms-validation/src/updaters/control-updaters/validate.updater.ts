import {
  NgrxSignalFormState,
  NgrxSignalFormStateUpdateFn,
  setErrors,
  setWarnings,
  updatersPipe
}                      from '@ngrx-signal-forms-test';
import { ValidatorFn } from '../../types/ngrx-signal-form-validation.types';

export function validate<TValue, TFormState extends NgrxSignalFormState<TValue>>(
  formState: TFormState,
  validators: Record<string, ValidatorFn<TValue, TFormState>[]>,
  softValidators: Record<string, ValidatorFn<TValue, TFormState>[]>
): NgrxSignalFormStateUpdateFn {

  return controlState => {

    const hasValidators = Object.hasOwn(validators, controlState.vId);
    const hasSoftValidators = Object.hasOwn(softValidators, controlState.vId);

    if (!hasValidators && !hasSoftValidators) {
      return controlState;
    }

    let errors: Record<string, unknown> = {};
    let warnings: Record<string, unknown> = {};

    if (hasValidators) {
      const validatorsFn = validators[controlState.vId];
      errors = validateFn<TValue, TFormState>(
        validatorsFn,
        controlState as unknown as NgrxSignalFormState<TValue>,
        formState
      );
    }

    if (hasSoftValidators) {
      const validatorsFn = softValidators[controlState.vId];
      warnings = validateFn<TValue, TFormState>(
        validatorsFn,
        controlState as unknown as NgrxSignalFormState<TValue>,
        formState
      );
    }

    return updatersPipe(
      setErrors(controlState.id, errors),
      setWarnings(controlState.id, warnings)
    )(controlState);
  };
}

function validateFn<TControlValue, TFormState>(
  validatorsFn: ValidatorFn<TControlValue, TFormState>[],
  controlState: NgrxSignalFormState<TControlValue>,
  formState: TFormState
): Record<string, unknown> {

  return validatorsFn.reduce((r, vFn) => {
    return Object.assign(r, vFn(controlState, formState));
  }, {} as Record<string, unknown>);
}

import { ValidatorFn } from '../types/ngrx-signal-form-validation.types';

export function max(maxValue: number): ValidatorFn {
  return controlState => {
    return isAboveMax(controlState.value, maxValue) ? {
      max: `${ controlState.id } must be lower then ${ maxValue }!`
    } : {};
  };
}

function isAboveMax(value: unknown, maxValue: number): boolean {
  if (!value || Number.isNaN(value)) {
    return false;
  }

  const v = value as number;

  return v > maxValue;
}

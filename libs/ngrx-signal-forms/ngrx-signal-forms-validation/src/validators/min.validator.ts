import { ValidatorFn } from '../types/ngrx-signal-form-validation.types';

export function min(minValue: number): ValidatorFn {
  return controlState => {
    return isBelowMin(controlState.value, minValue) ? {
      min: `${ controlState.id } must be higher then ${ minValue }!`
    } : {};
  };
}

function isBelowMin(value: unknown, minValue: number): boolean {
  if (!value || Number.isNaN(value)) {
    return false;
  }

  const v = value as number;

  return v < minValue;
}

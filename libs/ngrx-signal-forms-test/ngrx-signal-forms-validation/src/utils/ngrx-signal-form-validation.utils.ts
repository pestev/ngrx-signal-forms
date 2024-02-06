import { ensureArray, isObject }                  from '../../../src/lib/utils/utils';
import { AsyncValidatorConfig, AsyncValidatorFn } from '../types/ngrx-signal-form-async-validation.types';
import { ValidatorConfig, ValidatorFn }           from '../types/ngrx-signal-form-validation.types';

export function normalizeValidators<TValue, TFormState>(
  idPath: string,
  validatorsConfig?: ValidatorConfig<TValue, TFormState>
): Record<string, ValidatorFn<TValue, TFormState>[]>;

export function normalizeValidators<TValue, TFormState>(
  idPath: string,
  validatorsConfig?: AsyncValidatorConfig<TValue, TFormState>
): Record<string, AsyncValidatorFn<TValue, TFormState>[]>;

export function normalizeValidators<TValue, TFormState>(
  idPath: string,
  validatorsConfig?: ValidatorConfig<TValue, TFormState> | AsyncValidatorConfig<TValue, TFormState>
): Record<string, ValidatorFn<TValue, TFormState>[]> | Record<string, AsyncValidatorFn<TValue, TFormState>[]> {

  if (!validatorsConfig) {
    return {};
  }

  if (isObject(validatorsConfig)) {
    return Object.entries(validatorsConfig).reduce((acc, [ k, v ]) => {
      const key = `${ idPath }.${ k }`;
      return Object.assign(acc, normalizeValidators(key, v));
    }, {});
  }

  return {
    [idPath]: ensureArray(validatorsConfig)
  };
}

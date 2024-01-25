import { isObject }                     from '../../../src/lib/utils/utils';
import { ValidatorConfig, ValidatorFn } from '../types/ngrx-signal-form-validation.types';

export function normalizeValidators<TFormValue>(
  idPath: string,
  validatorsConfig?: ValidatorConfig<TFormValue>
): Record<string, ValidatorFn[]> {

  if (!validatorsConfig) {
    return {};
  }

  if (isObject(validatorsConfig)) {
    return Object.entries(validatorsConfig).reduce((acc, [ k, v ]) => {
      const key = `${ idPath }.${ k }`;
      return Object.assign(acc, normalizeValidators(key, v));
    }, {} as Record<string, ValidatorFn[]>);
  }

  return {
    [idPath]: ensureArray(validatorsConfig)
  };
}

function ensureArray<T>(v: T | T[]): T[] {

  return Array.isArray(v) ? v : [ v ];
}

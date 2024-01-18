import { isObject }                     from '../utils/utils';
import { ValidatorConfig, ValidatorFn } from './ngrx-signal-form-validation.types';

export function normalizeValidators<TFormValue>(
  idPath: string,
  validatorsConfig?: ValidatorConfig<TFormValue>
): Record<string, ValidatorFn> {

  if (!validatorsConfig) {
    return {};
  }

  if (isObject(validatorsConfig)) {
    return Object.entries(validatorsConfig).reduce((acc, [ k, v ]) => {
      const key = `${ idPath }.${ k }`;
      return Object.assign(acc, normalizeValidators(key, v));
    }, {} as Record<string, ValidatorFn>);
  }

  return {
    [idPath]: validatorsConfig
  };
}

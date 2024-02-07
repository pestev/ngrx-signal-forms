import { BaseControl, NgrxSignalFormState }       from '@ngrx-signal-forms-test';
import { Observable }                             from 'rxjs';
import { ensureArray, isObject }                  from '../../../src/lib/utils/utils';
import { AsyncValidatorConfig, AsyncValidatorFn } from '../types/ngrx-signal-form-async-validation.types';
import { ValidatorConfig, ValidatorFn }           from '../types/ngrx-signal-form-validation.types';

export function applyAsyncValidatorFn<TFormValue>($source: Observable<{
  formValue: TFormValue,
  controlState: BaseControl,
  formState: NgrxSignalFormState<TFormValue>,
  fn: AsyncValidatorFn<NgrxSignalFormState<TFormValue>>
}>) {

  return $source;
}

export function normalizeValidators<TValue, TFormState>(
  idPath: string,
  validatorsConfig?: ValidatorConfig<TValue, TFormState>
): Record<string, ValidatorFn<TValue, TFormState>[]> {

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

export function normalizeAsyncValidators<TValue, TFormState>(
  idPath: string,
  validatorsConfig?: AsyncValidatorConfig<TValue, TFormState>
): Record<string, AsyncValidatorFn<TFormState>> {

  if (!validatorsConfig) {
    return {};
  }

  if (isObject(validatorsConfig)) {
    return Object.entries(validatorsConfig).reduce((acc, [ k, v ]) => {
      const key = `${ idPath }.${ k }`;
      return Object.assign(acc, normalizeAsyncValidators(key, v));
    }, {});
  }

  return {
    [idPath]: validatorsConfig
  };
}

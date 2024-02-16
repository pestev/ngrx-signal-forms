import { NgrxSignalFormState } from '@ngrx-signal-forms-test';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
  switchMap,
  throwError
}                              from 'rxjs';
import {
  AsyncValidatorFn
}                              from '../types/ngrx-signal-form-async-validation.types';

export function generateAsyncValidatorFn<TFormValue>(config: {
  apiFn: <T>(value: T) => Observable<Record<string, unknown>>,
  debounceTime?: number
}): AsyncValidatorFn<NgrxSignalFormState<TFormValue>> {

  return source$ => {

    return source$.pipe(
      debounceTime(config.debounceTime || 0),
      distinctUntilChanged((p, c) => p === c, v => v.controlState.value),
      switchMap(payload => config.apiFn(payload.controlState.value).pipe(
        createAsyncValidationResponse({ id: payload.controlState.id })
      ))
    );
  };
}

export function createAsyncValidationResponse(config: {
  id: string,
  onError?: (error: unknown) => void
}): OperatorFunction<Record<string, unknown>, { id: string; errors: Record<string, unknown> }> {

  return $source => $source.pipe(
    map(result => ({
      id: config.id,
      errors: result
    })),
    catchError(error => {
      config.onError?.(error);

      return throwError(() => ({
        id: config.id,
        error
      }));
    })
  );
}

import { Injectable }                                                           from '@angular/core';
import { NgrxSignalFormState }                                                  from '@ngrx-signal-forms-test';
import {
  AsyncValidatorFn,
  createAsyncValidationResponse,
  generateAsyncValidatorFn
}                                                                               from '@ngrx-signal-forms-test/validation';
import { debounceTime, delay, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { ExampleInvoice }                                                       from '../../types/example.types';
import {
  getOne,
  save
}                                                                               from '../mock/example-invoice-data.mock';

@Injectable({ providedIn: 'root' })
export class ExampleInvoiceApiService {

  validateItemName = generateAsyncValidatorFn<ExampleInvoice>({
    debounceTime: 300,
    apiFn: (value) => this.validateNameApi(value as string)
  });

  load(id: number): Observable<ExampleInvoice> {
    return getOne(id).pipe(
      delay(1500)
    );
  }

  save(invoice: ExampleInvoice) {
    return save(invoice).pipe(
      delay(1500)
    );
  }

  validateNameApi(name: string) {

    if (!name) {
      return of({ asyncRequired: `Server response: Name must not be empty!` });
    }
    if (name.length < 3) {
      return of({ asyncMinLength: `Server response: Name "${ name }" must have at least 3 chars!` });
    }

    return of({});
  }

  validateCompanyName: AsyncValidatorFn<NgrxSignalFormState<ExampleInvoice>> = source$ => {
    return source$.pipe(
      debounceTime(300),
      distinctUntilChanged((p, c) => p === c, v => v.controlState.value),
      switchMap(payload => this.validateNameApi(payload.controlState.value as string).pipe(
        createAsyncValidationResponse({ id: payload.controlState.id })
      ))
    );
  };

}

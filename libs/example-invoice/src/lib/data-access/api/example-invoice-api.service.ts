import { Injectable }                                                                from '@angular/core';
import { NgrxSignalFormState }                                                       from '@ngrx-signal-forms-test';
import {
  AsyncValidatorFn
}                                                                                    from '@ngrx-signal-forms-test/validation';
import { debounceTime, delay, distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';
import { ExampleInvoice }                                                            from '../../types/example.types';
import {
  getOne,
  save
}                                                                                    from '../mock/example-invoice-data.mock';

@Injectable({ providedIn: 'root' })
export class ExampleInvoiceApiService {

  // readonly validateCompanyName$ = rxMethod<{
  //   controlState: BaseControl,
  //   formState: NgrxSignalFormGroup<ExampleInvoice>
  // }>(pipe(
  //   debounceTime(300),
  //   distinctUntilChanged(),
  //   switchMap(({ controlState }) => this.validateCompanyName(controlState.value as string)),
  //   tap(r => console.debug('res: ', r))
  // ));

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

  validateCompanyNameApi(name: string) {

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
      map(({ controlState }) => controlState.value as string),
      distinctUntilChanged((p, c) => {
        console.debug('distinct: ', p === c, { p, c });
        return p === c;
      }),
      switchMap(controlValue => this.validateCompanyNameApi(controlValue))
    );
  };

}

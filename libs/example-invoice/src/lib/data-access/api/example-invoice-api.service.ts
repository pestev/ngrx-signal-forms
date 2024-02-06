import { Injectable }            from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ExampleInvoice }        from '../../types/example.types';
import { getOne, save }          from '../mock/example-invoice-data.mock';

@Injectable({ providedIn: 'root' })
export class ExampleInvoiceApiService {

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

  validateCompanyName(name: string) {

    if (!name) {
      return of({ asyncRequired: `Server response: Name must not be empty!` });
    }
    if (name.length < 3) {
      return of({ asyncMinLength: `Server response: Name "${ name }" must have at least 3 chars!` });
    }

    return of({});
  }

}

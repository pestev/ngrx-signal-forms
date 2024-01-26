import { Injectable }        from '@angular/core';
import { delay, Observable } from 'rxjs';
import { ExampleInvoice }    from '../../types/example.types';
import { getOne }            from '../mock/example-invoice-data.mock';

@Injectable({ providedIn: 'root' })
export class ExampleInvoiceApiService {

  load(id: number): Observable<ExampleInvoice> {
    return getOne(id).pipe(
      delay(1500)
    );
  }

}

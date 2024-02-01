import { withNgrxSignalForm }                                          from '@ngrx-signal-forms';
import { max, min, minLength, required, withNgrxSignalFormValidation } from '@ngrx-signal-forms/validation';
import { signalStore }                                                 from '@ngrx/signals';
import { delay, of }                                                   from 'rxjs';
import { ExampleInvoice }                                              from '../../types/example.types';
import { withExampleData }                                             from './example-invoice-data.feature';

export const FORM_NAME = 'exampleInvoiceForm';

const exampleInvoiceInitial: ExampleInvoice = {
  id: 0,
  invoiceNumber: '',
  company: {
    name: '',
    address: {
      street: '',
      city: '',
      country: 'SR'
    }
  },
  client: {
    name: '',
    address: {
      street: '',
      city: '',
      country: 'SR'
    }
  },
  dueDate: '',
  inclVat: false,
  totalPriceInclVat: 0,
  items: [
    {
      id: 100,
      name: 'Item number 100',
      quantity: 1,
      unitPrice: 10,
      totalPrice: 10,
      vat: 20,
      totalPriceWithVat: 12
    }
  ]
};

export const signalExampleInvoiceStore = signalStore(
  withNgrxSignalForm({
    formName: FORM_NAME,
    initialFormValue: exampleInvoiceInitial
  }),

  withNgrxSignalFormValidation({
    formName: FORM_NAME,
    initialFormValue: exampleInvoiceInitial,
    // TODO somehow remove typescript error
    //@ ts-expect-error TS2589: Type instantiation is excessively deep and possibly infinite.
    validators: {
      items: {
        name: required,
        quantity: min(1),
        vat: max(20)
      }
    },
    softValidators: {
      invoiceNumber: [ required, minLength(3) ]
    },
    asyncValidators: {
      company: {
        // name: (control) => inject(ExampleInvoiceApiService).validateCompanyName(control.value)
        name: (control) =>
          of({ asyncRequired: `Server response: Name "${ control.value }" failed!` }).pipe(delay(2000))
      }
    }
  }),

  withExampleData({
    formName: FORM_NAME,
    initialValue: exampleInvoiceInitial
  })
);

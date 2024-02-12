import { withNgrxSignalForm }                                          from '@ngrx-signal-forms-test';
import { max, min, minLength, required, withNgrxSignalFormValidation } from '@ngrx-signal-forms-test/validation';
import { signalStore }                                                 from '@ngrx/signals';
import { ExampleInvoice }                                              from '../../types/example.types';
import { ExampleInvoiceApiService }                                    from '../api/example-invoice-api.service';
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
    },
    {
      id: 200,
      name: '',
      quantity: 1,
      unitPrice: 10,
      totalPrice: 10,
      vat: 20,
      totalPriceWithVat: 12
    },
    {
      id: 300,
      name: 'Item number 300',
      quantity: 1,
      unitPrice: 10,
      totalPrice: 10,
      vat: 20,
      totalPriceWithVat: 12
    }
  ]
};

export const SignalExampleInvoiceStore = signalStore(
  withNgrxSignalForm({
    formName: FORM_NAME,
    initialFormValue: exampleInvoiceInitial
  }),

  withNgrxSignalFormValidation({
    formName: FORM_NAME,
    initialFormValue: exampleInvoiceInitial,
    validators: {
      items: {
        // name: required,
        quantity: min(1),
        vat: max(20)
      }
    },
    softValidators: {
      invoiceNumber: [ required, minLength(3) ]
    },
    asyncServiceToken: ExampleInvoiceApiService,
    asyncValidators: (service) => ({
      company: {
        name: service.validateCompanyName
      },
      items: {
        name: service.validateItemName,
        quantity: service.validateItemName
      }
    })
    // asyncSoftValidators: (service) => ({
    //   client: {
    //     name: service.validateCompanyName
    //   }
    // })
  }),

  withExampleData({
    formName: FORM_NAME,
    initialValue: exampleInvoiceInitial
  })
);

import { CommonModule }                               from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ExampleCardComponent }                       from '@example/ui';
import {
  NgrxSignalFormAccessorsModule,
  NgrxSignalFormControlDirective,
  NgrxSignalFormDirective,
  required,
  withNgrxSignalForm
}                                                     from '@ngrx-signal-forms';
import { signalStore }                                from '@ngrx/signals';
import { ExampleCompany, ExampleItem }                from '../types/example.types';
import { ExampleAddressComponent }                    from './example-address/example-address.component';
import { ExampleCompanyComponent }                    from './example-company/example-company.component';

interface ExampleInvoice {
  id: string;
  company: ExampleCompany;
  client: ExampleCompany;
  dueDate: string;
  inclVat: boolean;
  items: ExampleItem[];
}

function generateItems(length: number): ExampleItem[] {
  return Array.from({ length }, (_, i) => ({
    id: i,
    name: `Item number ${ i }`,
    quantity: 1,
    unitPrice: 10,
    totalPrice: 10,
    vat: 20,
    totalPriceWithVat: 12
  }));
}

const FORM_NAME = 'exampleInvoiceForm';

const state: ExampleInvoice = {
  id: 'I2024003',
  company: {
    name: 'My company',
    address: {
      street: 'My street',
      city: 'My city',
      country: 'SR'
    }
  },
  client: {
    name: 'Super Partner',
    address: {
      street: 'Partner street',
      city: 'Partner city',
      country: 'CZ'
    }
  },
  dueDate: '2024-13-1',
  inclVat: false,
  items: generateItems(100)
};

const signalExampleInvoiceStore = signalStore(
  withNgrxSignalForm({
    formName: FORM_NAME,
    formValue: state,
    // TODO somehow remove typescript error
    //@ts-expect-error TS2589: Type instantiation is excessively deep and possibly infinite.
    validators: {
      items: {
        name: required
      }
    }
  })
);

@Component({
  selector: 's-f-example-invoice',
  standalone: true,
  imports: [
    CommonModule,
    ExampleCardComponent,
    NgrxSignalFormDirective,
    ExampleAddressComponent,
    ExampleCompanyComponent,
    NgrxSignalFormControlDirective,
    NgrxSignalFormAccessorsModule
  ],
  templateUrl: './example-invoice.component.html',
  styleUrls: [ './example-invoice.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    signalExampleInvoiceStore
  ]
})
export class ExampleInvoiceComponent {

  protected readonly store = inject(signalExampleInvoiceStore);

  protected readonly formSignal = this.store.exampleInvoiceForm;

}

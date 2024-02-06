import { CommonModule }                                       from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ExampleCardComponent }                               from '@example/ui';
import {
  NgrxSignalFormAccessorsModule,
  NgrxSignalFormControlDirective,
  NgrxSignalFormDirective
}                                                             from '@ngrx-signal-forms-test';
import {
  SignalExampleInvoiceStore
}                                                             from '../data-access/store/example-invoice.store';
import {
  ExampleAddressComponent
}                                                             from './example-address/example-address.component';
import {
  ExampleCompanyComponent
}                                                             from './example-company/example-company.component';

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
    SignalExampleInvoiceStore
  ]
})
export class ExampleInvoiceComponent {

  protected readonly store = inject(SignalExampleInvoiceStore);

  protected readonly formSignal = this.store.formState;

  protected readonly isLoadingSignal = this.store.isLoading;

  protected readonly isSavingSignal = this.store.isSaving;

  protected readonly apiErrorSignal = this.store.apiError;

  constructor() {
    effect(() => {
      console.debug('formState: ', this.formSignal());
    });
  }

  loadInvoice(id: number): void {
    this.store.setCurrentId(id);
  }

  resetToInitial(): void {
    this.store.reset();
  }

  submit(): void {
    this.store.submit();
  }
}

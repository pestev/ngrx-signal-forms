import { Component, effect, inject } from '@angular/core';
import { RouterModule }              from '@angular/router';
import {
  NgrxSignalFormAccessorsModule,
  NgrxSignalFormControlDirective,
  NgrxSignalFormDirective,
  NgrxSignalFormStylingDirective,
  required,
  withNgrxSignalForm
}                                    from '@ngrx-signal-forms';
import { signalStore }               from '@ngrx/signals';

const FORM_NAME = 'exampleForm';

const state = {
  name: 'MyFirstName',
  surname: 'MySecondName',
  address: {
    street: 'My street',
    city: 'My city'
  },
  items: [
    {
      itemId: 1,
      itemName: 'Item number 1'
    },
    {
      itemId: 2,
      itemName: 'Item number 2'
    }, {
      itemId: 3,
      itemName: 'Item number 3'
    }
  ]
};

const signalExampleStore = signalStore(
  withNgrxSignalForm({
    formName: FORM_NAME,
    formValue: state,
    // TODO somehow remove typescript error
    //@ts-expect-error TS2589: Type instantiation is excessively deep and possibly infinite.
    validators: {
      name: required,
      address: {
        city: required
      },
      items: {
        itemName: required
      }
    }
  })
);

@Component({
  selector: 'ngrx-signal-forms-root',
  standalone: true,
  imports: [
    RouterModule,
    NgrxSignalFormDirective,
    NgrxSignalFormControlDirective,
    NgrxSignalFormStylingDirective,
    NgrxSignalFormAccessorsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  providers: [
    signalExampleStore
  ]
})
export class AppComponent {

  title = 'ngrx-signal-forms-example';

  protected readonly store = inject(signalExampleStore);

  protected readonly formSignal = this.store.exampleForm;

  constructor() {
    console.debug('store: ', this.store);

    effect(() => console.debug('form: ', this.formSignal()));
  }

  reloadForm(): void {
    this.store.reset(state);
  }

  updateAddress(): void {
    this.store.updateValue('exampleForm.address', {
      street: 'My updated street',
      city: 'My updated city'
    });
  }

  updateItem(): void {
    this.store.updateValue('exampleForm.items.0', {
      itemId: 1,
      itemName: 'Changed item name'
    });
  }

  disableAddress(): void {
    this.store.updateDisabled('exampleForm.address', true);
  }

  nameError(): void {
    this.store.updateErrors('exampleForm.name', { someError: 'Description for some error' });
  }

  streetWarning(): void {
    this.store.updateWarnings('exampleForm.address.street', { someError: 'Description for some error' });
  }

  validate(): void {
    this.store.validate();
  }

}

import { Directive, Input, Signal } from '@angular/core';
import { SignalStoreFeatureResult } from '@ngrx/signals/src/signal-store-models';
import { NgrxSignalFormGroup }      from '../types/ngrx-signal-form.types';

@Directive({
  selector: 'form[ngrxSignalFormGroup]',
  standalone: true
})
export class NgrxSignalFormGroupDirective<TGroup extends SignalStoreFeatureResult> {

  @Input({ required: true }) ngrxSignalForm!: Signal<NgrxSignalFormGroup<TGroup>>;

}

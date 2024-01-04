import { Directive, Input }                  from '@angular/core';
import { NgrxSignalFormStoreFeatureMethods } from '../ngrx-signal-form-store-feature';
import { Primitive }                         from '../types/ngrx-signal-form.types';

@Directive({
  selector: 'form[ngrxSignalForm]',
  standalone: true
})
export class NgrxSignalFormDirective<
  TStore extends NgrxSignalFormStoreFeatureMethods
> {

  @Input({ required: true }) ngrxSignalForm!: TStore;

  updateValue(controlId: string, value: object | unknown[] | Primitive): void {
    this.ngrxSignalForm.updateValue(controlId, value);
  }

  updateTouched(controlId: string, isTouched: boolean): void {
    this.ngrxSignalForm.updateTouched(controlId, isTouched);
  }
}

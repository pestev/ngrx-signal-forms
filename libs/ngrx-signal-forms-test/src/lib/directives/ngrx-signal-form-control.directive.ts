import { Directive, effect, Inject, input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR }          from '@angular/forms';
import { NgrxSignalFormStoreFeatureMethods }                from '../ngrx-signal-form-store-feature';
import { NgrxSignalFormControl, Primitive }                 from '../types/ngrx-signal-form.types';
import { NgrxSignalFormStylingDirective }                   from './ngrx-signal-form-styling.directive';
import { NgrxSignalFormDirective }                          from './ngrx-signal-form.directive';

@Directive({
  selector: '[ngrxSignalFormControl]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgrxSignalFormStylingDirective,
      inputs: [ 'ngrxSignalFormStyling: ngrxSignalFormControl' ]
    }
  ]
})
export class NgrxSignalFormControlDirective<
  TValue extends Primitive,
  TStore extends NgrxSignalFormStoreFeatureMethods
> {

  readonly formControlSignal = input.required<NgrxSignalFormControl<TValue> | null>({
    alias: 'ngrxSignalFormControl'
  });

  private readonly valueAccessor: ControlValueAccessor;

  constructor(
    private form: NgrxSignalFormDirective<TStore>,
    @Self() @Optional() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[]
  ) {
    if (!valueAccessors.length) {
      throw new Error('Missing control value accessor');
    }

    this.valueAccessor = valueAccessors[0];

    this.writeToElement();
    this.changeDisabled();
    this.changesFromElement();
    this.touchedElement();
  }

  private writeToElement(): void {
    effect(() => {
      // TODO check immutability. Should we hold previous value and write only if has changed?
      this.valueAccessor.writeValue(this.formControlSignal()?.value);
    });
  }

  private changeDisabled(): void {
    effect(() => {
      // TODO check immutability. Should we hold previous state and change only if has changed?
      const formControl = this.formControlSignal();
      if (formControl) {
        this.valueAccessor.setDisabledState?.(formControl.isDisabled);
      }
    });
  }

  private changesFromElement(): void {
    this.valueAccessor.registerOnChange((value: TValue) => {
      const formControl = this.formControlSignal();
      if (formControl) {
        this.form.updateValue(formControl.id, value);
      }
    });
  }

  private touchedElement(): void {
    this.valueAccessor.registerOnTouched(() => {
      const formControl = this.formControlSignal();
      if (formControl) {
        this.form.updateTouched(formControl.id, true);
      }
    });
  }

}

import { NgModule }                             from '@angular/core';
import { CheckboxValueAccessorDirective }       from './checkbox-value-accessor.directive';
import { DefaultValueAccessorDirective }        from './default-value-accessor.directive';
import { NumberValueAccessorDirective }         from './number-value-accessor.directive';
import { RadioValueAccessorDirective }          from './radio-value-accessor.directive';
import { RangeValueAccessorDirective }          from './range-value-accessor.directive';
import { SelectMultipleValueAccessorDirective } from './select-multiple-value-accessor.directive';
import { SelectValueAccessorDirective }         from './select-value-accessor.directive';

@NgModule({
  imports: [
    DefaultValueAccessorDirective,
    CheckboxValueAccessorDirective,
    NumberValueAccessorDirective,
    RadioValueAccessorDirective,
    RangeValueAccessorDirective,
    SelectValueAccessorDirective,
    SelectMultipleValueAccessorDirective
  ],
  exports: [
    DefaultValueAccessorDirective,
    CheckboxValueAccessorDirective,
    NumberValueAccessorDirective,
    RadioValueAccessorDirective,
    RangeValueAccessorDirective,
    SelectValueAccessorDirective,
    SelectMultipleValueAccessorDirective
  ]
})
export class NgrxSignalFormAccessorsModule {
}

import { NgModule }                      from '@angular/core';
import { DefaultValueAccessorDirective } from './default-value-accessor.directive';

@NgModule({
  imports: [
    DefaultValueAccessorDirective
  ],
  exports: [
    DefaultValueAccessorDirective
  ]
})
export class NgrxSignalFormAccessorsModule {
}

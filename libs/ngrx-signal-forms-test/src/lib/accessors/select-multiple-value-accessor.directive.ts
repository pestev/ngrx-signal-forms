import { Directive, forwardRef }                                 from '@angular/core';
import { NG_VALUE_ACCESSOR, SelectMultipleControlValueAccessor } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'select[multiple][ngrxSignalFormControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMultipleValueAccessorDirective),
      multi: true
    }
  ]
})
export class SelectMultipleValueAccessorDirective extends SelectMultipleControlValueAccessor {
}

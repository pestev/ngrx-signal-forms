import { Directive, forwardRef }                 from '@angular/core';
import { NG_VALUE_ACCESSOR, RangeValueAccessor } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type=range][ngrxSignalFormControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeValueAccessorDirective),
      multi: true
    }
  ]
})
export class RangeValueAccessorDirective extends RangeValueAccessor {
}

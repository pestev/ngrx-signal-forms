import { Directive, forwardRef }                   from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input:not([type=checkbox]):not([type=radio])[ngrxSignalFormControl],textarea[ngrxSignalFormControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DefaultValueAccessorDirective),
      multi: true
    }
  ]
})
export class DefaultValueAccessorDirective extends DefaultValueAccessor {
}

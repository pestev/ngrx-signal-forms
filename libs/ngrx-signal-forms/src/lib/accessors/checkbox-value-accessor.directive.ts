import { Directive, forwardRef }                           from '@angular/core';
import { CheckboxControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type=checkbox][ngrxSignalFormControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxValueAccessorDirective),
      multi: true
    }
  ]
})
export class CheckboxValueAccessorDirective extends CheckboxControlValueAccessor {
}

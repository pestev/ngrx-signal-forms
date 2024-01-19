import { Directive, forwardRef }                         from '@angular/core';
import { NG_VALUE_ACCESSOR, SelectControlValueAccessor } from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'select:not([multiple])[ngrxSignalFormControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectValueAccessorDirective),
      multi: true
    }
  ]
})
export class SelectValueAccessorDirective extends SelectControlValueAccessor {
}

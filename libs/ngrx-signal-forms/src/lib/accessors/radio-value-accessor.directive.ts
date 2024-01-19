import { Directive, ElementRef, forwardRef, inject, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR }              from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type=radio][ngrxSignalFormControl]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioValueAccessorDirective),
      multi: true
    }
  ]
})
export class RadioValueAccessorDirective implements ControlValueAccessor {

  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private elementValue = this.elementRef.nativeElement.value;

  constructor() {
    console.debug('RadioValueAccessorDirective ', this.elementValue);
  }

  writeValue(value: any): void {
    if (this.elementValue === value) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'checked', 'checked');
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'checked');
    }
  }

  registerOnChange(fn: any): void {
    if (!fn) {
      return;
    }

    this.renderer.listen(
      this.elementRef.nativeElement,
      'change',
      () => fn(this.elementRef.nativeElement.value)
    );
  }

  registerOnTouched(fn: any): void {
    if (!fn) {
      return;
    }

    this.renderer.listen(
      this.elementRef.nativeElement,
      'blur',
      fn
    );
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'disabled', 'disabled');
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'disabled');
    }
  }

}

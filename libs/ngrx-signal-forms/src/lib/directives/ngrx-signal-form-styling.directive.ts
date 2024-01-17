import { Directive, effect, ElementRef, inject, Input, Renderer2, signal, WritableSignal } from '@angular/core';
import {
  BaseControl
}                                                                                          from '../types/ngrx-signal-form.types';

@Directive({
  selector: '[ngrxSignalFormStyling]',
  standalone: true
})
export class NgrxSignalFormStylingDirective {

  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  private formControlSignal: WritableSignal<BaseControl | null> = signal(null);

  constructor() {
    this.initStyling();
  }

  @Input()
  set ngrxSignalFormStyling(v: BaseControl) {
    this.formControlSignal.set(v);
  }

  private initStyling() {

    const element = this.elementRef.nativeElement;

    effect(() => {
      const control = this.formControlSignal();

      if (!control) {
        return;
      }

      if (control.hasErrors) {
        this.renderer.addClass(element, 's-f-invalid');
      } else {
        this.renderer.removeClass(element, 's-f-invalid');
      }

      if (control.hasWarnings) {
        this.renderer.addClass(element, 's-f-soft-invalid');
      } else {
        this.renderer.removeClass(element, 's-f-soft-invalid');
      }

      if (control.isDirty) {
        this.renderer.addClass(element, 's-f-dirty');
        this.renderer.removeClass(element, 's-f-pristine');
      } else {
        this.renderer.addClass(element, 's-f-pristine');
        this.renderer.removeClass(element, 's-f-dirty');
      }

      if (control.isDisabled) {
        this.renderer.addClass(element, 's-f-disabled');
      } else {
        this.renderer.removeClass(element, 's-f-disabled');
      }

      if (control.isTouched) {
        this.renderer.addClass(element, 's-f-touched');
        this.renderer.removeClass(element, 's-f-untouched');
      } else {
        this.renderer.addClass(element, 's-f-untouched');
        this.renderer.removeClass(element, 's-f-touched');
      }

    });
  }
}

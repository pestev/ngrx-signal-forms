import { CommonModule }                              from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  NgrxSignalFormAccessorsModule,
  NgrxSignalFormControlDirective,
  NgrxSignalFormGroup,
  NgrxSignalFormStylingDirective
}                                                    from '@ngrx-signal-forms-test';
import { Address }                                   from '../../types/example.types';

@Component({
  selector: 's-f-example-address',
  standalone: true,
  imports: [
    CommonModule,
    NgrxSignalFormAccessorsModule,
    NgrxSignalFormStylingDirective,
    NgrxSignalFormControlDirective
  ],
  templateUrl: './example-address.component.html',
  styleUrls: [ './example-address.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleAddressComponent {

  @Input({ required: true }) addressFormState!: NgrxSignalFormGroup<Address>;

}

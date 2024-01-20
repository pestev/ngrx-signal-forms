import { CommonModule }                              from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgrxSignalFormGroup }                       from '@ngrx-signal-forms';
import { ExampleCompany }                            from '../../types/example.types';
import { ExampleAddressComponent }                   from '../example-address/example-address.component';

@Component({
  selector: 's-f-example-company',
  standalone: true,
  imports: [ CommonModule, ExampleAddressComponent ],
  templateUrl: './example-company.component.html',
  styleUrls: [ './example-company.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleCompanyComponent {

  @Input({ required: true }) companyFormState!: NgrxSignalFormGroup<ExampleCompany>;

  @Input({ required: true }) title!: string;

}

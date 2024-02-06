import { Component }               from '@angular/core';
import { RouterModule }            from '@angular/router';
import { ExampleInvoiceComponent } from '@example';
import {
  NgrxSignalFormAccessorsModule,
  NgrxSignalFormControlDirective,
  NgrxSignalFormDirective,
  NgrxSignalFormStylingDirective
}                                  from '@ngrx-signal-forms-test';

@Component({
  selector: 'ngrx-signal-forms-root',
  standalone: true,
  imports: [
    RouterModule,
    NgrxSignalFormDirective,
    NgrxSignalFormControlDirective,
    NgrxSignalFormStylingDirective,
    NgrxSignalFormAccessorsModule,
    ExampleInvoiceComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

  title = 'ngrx-signal-forms-example';

}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ngrx-signal-forms-test-ngrx-signal-forms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ngrx-signal-forms.component.html',
  styleUrl: './ngrx-signal-forms.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgrxSignalFormsComponent {}

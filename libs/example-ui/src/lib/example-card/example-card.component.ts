import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 's-f-example-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './example-card.component.html',
  styleUrls: ['./example-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleCardComponent {}

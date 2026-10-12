import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-custom.component.html',
  styleUrl: './card-custom.component.css',
})
export class CardCustomComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtext: string = '';
  @Input() iconClass: string = 'text-sky-600';
  @Input() iconBgClass: string = 'bg-sky-50';
  @Input() variant: 'default' | 'right-icon' = 'default';
}

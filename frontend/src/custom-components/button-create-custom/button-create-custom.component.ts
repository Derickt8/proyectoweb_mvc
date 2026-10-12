import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonCustomType } from '@/app/core/utils/button-custom.type';

@Component({
  selector: 'app-button-create-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-create-custom.component.html',
  styleUrl: './button-create-custom.component.css',
})
export class ButtonCreateCustomComponent {
  @Input({ required: true }) data!: ButtonCustomType;
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}

import { Component, input, output } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-custom-modal',
  imports: [],
  templateUrl: './custom-modal.component.html',
  styleUrl: './custom-modal.component.scss',
  animations: [
    trigger('modalAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.9)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
    trigger('backgroundAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          backdropFilter: 'blur(0px)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          backdropFilter: 'blur(5px)',
        })
      ),
      transition('void <=> *', animate('200ms ease-in-out')),
    ]),
  ],
})
export class CustomModalComponent {
  isOpen = input(false);
  title = input('Custom Modal');

  close = output();
  closeModal() {
    this.close.emit();
  }
}

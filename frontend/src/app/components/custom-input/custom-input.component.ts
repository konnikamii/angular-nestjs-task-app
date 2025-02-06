import { Component, EventEmitter, input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-custom-input',
  imports: [],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss'
})
export class CustomInputComponent { 
  type = input<'text' |'password' | 'email'>('text');
  id = input('');
  name = input<string|null>(null);
  placeholder = input<string|null>(null);
  value = input<string|null>(null);
  prefixIcon = input<'user' |'password' | 'email'|null>(null);
  prefixClass = input<string|null>(null);
  errorMessage = input<string | null>(null); 
  maxLength = input<number|null>(null);
  showCharacters = input(false);


  @Output() inputEvent = new EventEmitter<Event>();
  @Output() keyboardEvent = new EventEmitter<KeyboardEvent>();
  @Output() clearInputEvent = new EventEmitter<void>(); 
  

  inputEventEmitter(event: Event) { 
    this.inputEvent.emit(event); 
  }

  keyboardEventEmitter(event: KeyboardEvent) {
    this.keyboardEvent.emit(event);  
  }
  clearInput() { 
    this.clearInputEvent.emit();  
  }
 
}

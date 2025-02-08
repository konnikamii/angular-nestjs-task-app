import { Component,  input, output  } from '@angular/core';

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
  isDisabled = input(false);
  allowClear = input(true);
 
  inputEvent = output<Event>();
  keyboardEvent = output<KeyboardEvent>();
  clearInputEvent = output();
  

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

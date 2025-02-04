import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-logo',
  imports: [],
  templateUrl: './logo.component.html', 
})
export class LogoComponent {  
  class = input('')
  isLight = input(true) 

  isHovered = signal(false); 
  handleMouseEnter() {
    this.isHovered.set(true);
  } 
  handleMouseLeave() {
    this.isHovered.set(false);
  }
}

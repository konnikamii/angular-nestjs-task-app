import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-email',
  imports: [],
  templateUrl: './email.component.html', 
})
export class EmailComponent {
  width = input('32')
  height = input('32')
  fill = input('none')
  strokeWidth = input('1.8') 
}

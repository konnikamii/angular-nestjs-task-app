import { Component, input } from '@angular/core';

@Component({
  selector: 'app-theme-toggle-dark',
  imports: [],
  templateUrl: './theme-toggle-dark.component.html', 
})
export class ThemeToggleDarkComponent {
  className = input('')

}

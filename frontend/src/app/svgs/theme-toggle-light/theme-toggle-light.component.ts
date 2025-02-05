import { Component, input } from '@angular/core';

@Component({
  selector: 'app-theme-toggle-light',
  imports: [],
  templateUrl: './theme-toggle-light.component.html', 
})
export class ThemeToggleLightComponent {
  className = input('')
}

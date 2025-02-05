import { Component, Inject, inject, Input, OnInit, Renderer2, signal } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { LogoComponent } from "../../svgs/_nav/logo/logo.component";
import { ThemeService } from '../../services/theme.service';
import { DOCUMENT } from '@angular/common';
import { ThemeToggleLightComponent } from "../../svgs/theme-toggle-light/theme-toggle-light.component";
import { ThemeToggleDarkComponent } from "../../svgs/theme-toggle-dark/theme-toggle-dark.component";

@Component({
  selector: 'app-home-navbar',
  imports: [RouterLink, LogoComponent, ThemeToggleLightComponent, ThemeToggleDarkComponent],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.scss'
})
export class HomeNavbarComponent implements OnInit { 
  themeService = inject(ThemeService);
  renderer = inject(Renderer2);
  document = inject(DOCUMENT); 
  
  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);
 
  ngOnInit() { 
    this.updateThemeClass(this.themeService.isLight);
    this.themeService.theme$.subscribe(newTheme => {
      this.theme.set(newTheme);
      this.isLight.set(this.themeService.isLight) 
      this.updateThemeClass(this.themeService.isLight);
    });
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme); 
  }

  private updateThemeClass(isLight: boolean) {
    const rootElement = this.document.getElementById('root');
    if (rootElement) {
      if (isLight) {
        this.renderer.removeClass(rootElement, 'dark');
      } else {
        this.renderer.addClass(rootElement, 'dark');
      }
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject: BehaviorSubject<'light' | 'dark'>;
  theme$;

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const defaultTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (!savedTheme) {
      localStorage.setItem('theme', defaultTheme);
    }
    this.themeSubject = new BehaviorSubject<'light' | 'dark'>(defaultTheme);
    this.theme$ = this.themeSubject.asObservable();
  }

  setTheme(theme: 'light' | 'dark') {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
  }

  get isLight(): boolean {
    return this.themeSubject.value === 'light';
  }
}
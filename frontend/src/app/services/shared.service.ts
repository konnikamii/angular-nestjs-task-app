import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  private dimsSubject = new BehaviorSubject({
    isLandscape: false,
    plus500h: false,
    plus768h: false,
    plus1080h: false,
    plus375: false,
    plus425: false,
    plus768: false,
    plus1024: false,
    plus1440: false,
    plus550: false,
  });

  theme$ = this.themeSubject.asObservable();
  dims$ = this.dimsSubject.asObservable();

  setTheme(theme: 'light' | 'dark') {
    this.themeSubject.next(theme);
  }

  setDims(dims: any) {
    this.dimsSubject.next(dims);
  }
}

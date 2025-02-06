import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DimensionContextType } from '../utils_other/types';
import { defaultDims } from '../utils_other/defaults';

@Injectable({
  providedIn: 'root'
})
export class DimensionsService {
  private dimsSubject: BehaviorSubject<DimensionContextType>;
  dims$: Observable<DimensionContextType>;

  constructor(private breakpointObserver: BreakpointObserver) {
    const initialDims = defaultDims

    this.dimsSubject = new BehaviorSubject<DimensionContextType>(initialDims);
    this.dims$ = this.dimsSubject.asObservable();

    this.observeBreakpoints();
  }

  private observeBreakpoints() {
    this.breakpointObserver.observe([
      '(orientation: landscape)',
      '(min-height: 500px)',
      '(min-height: 768px)',
      '(min-height: 1080px)',
      '(min-width: 375px)',
      '(min-width: 425px)',
      '(min-width: 550px)',
      '(min-width: 768px)',
      '(min-width: 1024px)',
      '(min-width: 1440px)'
    ]).pipe(
      map((state: BreakpointState) => {
        const newDims = {
          isLandscape: state.breakpoints['(orientation: landscape)'],
          plus500h: state.breakpoints['(min-height: 500px)'],
          plus768h: state.breakpoints['(min-height: 768px)'],
          plus1080h: state.breakpoints['(min-height: 1080px)'],
          plus375: state.breakpoints['(min-width: 375px)'],
          plus425: state.breakpoints['(min-width: 425px)'],
          plus550: state.breakpoints['(min-width: 550px)'],
          plus768: state.breakpoints['(min-width: 768px)'],
          plus1024: state.breakpoints['(min-width: 1024px)'],
          plus1440: state.breakpoints['(min-width: 1440px)'],
        };
        this.dimsSubject.next(newDims);
      })
    ).subscribe();
  }
}
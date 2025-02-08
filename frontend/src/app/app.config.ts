import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideTanStackQuery,
  QueryClient,
  withDevtools,
} from '@tanstack/angular-query-experimental'
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';


export const appConfig: ApplicationConfig = {
  providers: [provideNativeDateAdapter(),DatePipe,
    provideHttpClient(
      withFetch(),), provideTanStackQuery(new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60 * .5, // .5 hour
            gcTime: 1000 * 60 * 60 * 6, // 6 hours
          },
        },
      }), withDevtools()),importProvidersFrom([BrowserAnimationsModule]),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SideLinesComponent } from '../../components/side-lines/side-lines.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ThemeService } from '../../services/theme.service';
import {
  BACKEND_URL,
  btnClassPrimaryDarkBlue,
} from '../../utils_other/defaults';
import {
  rippleAnimation,
  toastMessage,
} from '../../utils_other/helperFunctions';
import {
  LoginErrors,
  LoginResponse,
  LoginValues,
} from '../../utils_other/types';

import { provideNativeDateAdapter } from '@angular/material/core';
import { CustomInputComponent } from '../../components/custom-input/custom-input.component';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [RouterLink, SideLinesComponent, CustomInputComponent],
  providers: [provideNativeDateAdapter()],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  themeService = inject(ThemeService);
  router = inject(Router);
  http = inject(HttpClient);

  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);

  values = signal<LoginValues>({ username: null, password: null });
  errors = signal<LoginErrors>({
    username: null,
    password: null,
    global: null,
  });
  loadingState = signal(false);
  isDisabled = computed(
    () =>
      this.errors().username ||
      this.errors().password ||
      this.errors().global ||
      this.loadingState()
  );
  btnClassPrimaryDarkBlue = btnClassPrimaryDarkBlue;

  ngOnInit() {
    this.themeService.theme$.subscribe((newTheme) => {
      this.theme.set(newTheme);
      this.isLight.set(this.themeService.isLight);
    });
  }

  handleEnterSubmit(event: KeyboardEvent) {
    if (event.key === 'Enter' && !this.isDisabled()) {
      this.handleSubmit();
    }
  }
  handleClickSubmit(e: MouseEvent) {
    rippleAnimation(e, this.isLight(), 1300);
    this.handleSubmit();
  }

  handleSubmit() {
    if (!this.values().username) {
      this.errors.update((prev) => ({
        ...prev,
        username: 'Please provide your username!',
      }));
    }
    if (!this.values().password) {
      this.errors.update((prev) => ({
        ...prev,
        password: 'Please provide your password!',
      }));
    }

    if (
      this.values().username &&
      this.values().password &&
      !this.errors().username &&
      !this.errors().password
    ) {
      this.loadingState.set(true);

      const formData = new FormData();
      formData.append('username', this.values().username ?? '');
      formData.append('password', this.values().password ?? '');

      this.http
        .post<LoginResponse>(`${BACKEND_URL}api/login/`, formData)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            const res = error.error;
            if (res) {
              this.errors.update((prev) => ({ ...prev, global: res.message }));
              toastMessage(res.message, 'error', 2000);
            } else {
              toastMessage('An unexpected error occurred.', 'error', 2000);
              this.errors.update((prev) => ({
                ...prev,
                global: 'An unexpected error occurred.',
              }));
            }
            setTimeout(() => {
              this.loadingState.set(false);
            }, 500);
            throw error;
          })
        )
        .subscribe((res: LoginResponse | null) => {
          if (res) {
            localStorage.setItem('access_token', res.access_token);
            this.values.update((prev) => ({
              ...prev,
              username: null,
              password: null,
            }));
            toastMessage('Success', 'success', 1000);
            setTimeout(() => {
              toastMessage(
                'Redirecting you to the application...',
                'loading',
                1000
              );
            }, 500);
            setTimeout(() => {
              this.loadingState.set(false);
            }, 1000);
            setTimeout(() => {
              this.router.navigate(['/app']);
            }, 1000);
          }
        });
    }
  }

  handleInputChangeUsername(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces
    this.values.update((prev) => ({ ...prev, username: value ? value : null }));
    this.errors.update((prev) => ({ ...prev, username: null }));
    this.errors.update((prev) => ({ ...prev, global: null }));
  }

  handleInputChangePassword(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces
    this.values.update((prev) => ({ ...prev, password: value ? value : null }));
    this.errors.update((prev) => ({ ...prev, password: null }));
    this.errors.update((prev) => ({ ...prev, global: null }));
  }
  clearUsername() {
    this.values.update((prev) => ({ ...prev, username: null }));
  }
  clearPassword() {
    this.values.update((prev) => ({ ...prev, password: null }));
  }
}

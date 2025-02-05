import { Component, computed, inject, signal } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router';
import { SideLinesComponent } from "../../components/side-lines/side-lines.component";
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../../services/theme.service';
import { BubblesBackgroundComponent } from "../../components/bubbles-background/bubbles-background.component";
import { BACKEND_URL, btnClassPrimaryDarkBlue } from '../../utils_other/defaults';
import { rippleAnimation } from '../../utils_other/helperFunctions';
import { LoginErrors, LoginValues } from '../../utils_other/types';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-login',
  imports: [RouterLink, SideLinesComponent, BubblesBackgroundComponent, FormsModule, MatFormFieldModule, MatInputModule,MatSelectModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent { 

  
  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }


  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);
  values = signal<LoginValues>({ username: '', password: '' });
  errors =  signal<LoginErrors>({ username: null, password: null, global: null })
  loadingState = signal(false);
  isDisabled = computed(() =>  this.errors().username || this.errors().password || this.errors().global || this.loadingState() );
  btnClassPrimaryDarkBlue = btnClassPrimaryDarkBlue
  themeService = inject(ThemeService);
  router = inject(Router);
  http = inject(HttpClient); 

  ngOnInit() { 
    this.themeService.theme$.subscribe(newTheme => {
      this.theme.set(newTheme);
      this.isLight.set(this.themeService.isLight);
    });
  }

  handleEnterSubmit(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }
  handleClickSubmit(e: MouseEvent) { 
    rippleAnimation(e, this.isLight(), 1300);
    this.handleSubmit(); 
  }

  handleSubmit() {
    this.loadingState.set(true);
    
    if (!this.values().username) {
      this.errors.update(prev => ({...prev, username: "Please provide your username!"})) ;
    }
    if (!this.values().password) {
      this.errors.update(prev => ({...prev, password: "Please provide your password!"})) ; 
    }

    if (this.values().username && this.values().password && !this.errors().username && !this.errors().password) {
      const formData = new FormData();
      formData.append('username', this.values().username ?? '');
      formData.append('password', this.values().password ?? '');
      this.http.post(`${BACKEND_URL}api/login/`, formData).subscribe(
        (response: any) => {
          // Handle successful login
          localStorage.setItem('access_token', response.access_token);
          this.loadingState.set(false);
          this.router.navigate(['/app']);
        },
        (error: any) => {
          // Handle login error
          const res = error.error;
          if (res) {
            const newErr = res.detail;
            if (newErr.includes('assword')) { 
              this.errors.update(prev => ({...prev, password: newErr})) ; 
            } else if (newErr.includes('sername')) { 
              this.errors.update(prev => ({...prev, username: newErr})) ;
            } else { 
              this.errors.update(prev => ({...prev, global: newErr})) ;
            }
          } else {
            this.errors.update(prev => ({...prev, global: 'An unexpected error occurred.'})) ; 
          }
          this.loadingState.set(false);
        }
      );
    } else {
      this.loadingState.set(false);
    }
  }

  handleInputChangeUsername(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces 
    this.values.update(prev => ({ ...prev, username: value ? value : null }));
    this.errors.update(prev => ({ ...prev, username: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }

  handleInputChangePassword(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces 
    this.values.update(prev => ({ ...prev, password: value ? value : null }));
    this.errors.update(prev => ({ ...prev, password: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }

}

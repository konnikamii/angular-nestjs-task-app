import { Component, computed, inject, signal } from '@angular/core'; 
import { Router, RouterLink } from '@angular/router';
import { SideLinesComponent } from "../../components/side-lines/side-lines.component";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ThemeService } from '../../services/theme.service'; 
import { BACKEND_URL, btnClassPrimaryDarkBlue } from '../../utils_other/defaults';
import { rippleAnimation, toastMessage, validateEmail, validatePassword, validateUsername } from '../../utils_other/helperFunctions';
import { RegisterErrors, RegisterValues, User } from '../../utils_other/types';

import { CustomInputComponent } from "../../components/custom-input/custom-input.component";
import { catchError } from 'rxjs';
 
@Component({
  selector: 'app-register',
  imports: [RouterLink, SideLinesComponent, CustomInputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  themeService = inject(ThemeService);
  router = inject(Router);
  http = inject(HttpClient); 

  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);
 
  values = signal<RegisterValues>({ username: null, email: null ,password: null, confirm_password: null });
  errors =  signal<RegisterErrors>({ username: null, email: null ,password: null, confirm_password: null, global: null })
  loadingState = signal(false);
  isErrors = computed(() => this.errors().username || this.errors().email || this.errors().password || this.errors().confirm_password || this.errors().global); 
  isDisabled = computed(() =>  this.isErrors() || this.loadingState() );
  btnClassPrimaryDarkBlue = btnClassPrimaryDarkBlue
    

  ngOnInit() { 
    this.themeService.theme$.subscribe(newTheme => {
      this.theme.set(newTheme);
      this.isLight.set(this.themeService.isLight);
    });
  }

  handleEnterSubmit(e: KeyboardEvent) { 
    if (e.key === 'Enter' && !this.isDisabled()) {
      this.handleSubmit();
    }
  }
  handleClickSubmit(e: MouseEvent) { 
    rippleAnimation(e, this.isLight(), 1300);
    this.handleSubmit(); 
  }

  handleSubmit() {
    const data = this.values();  
    if (!data.username) {
      this.errors.update(prev => ({...prev, username: "Please provide your username!"})) ;
    } else {
      const usernameErr = validateUsername(data.username);
      if (usernameErr) {
        this.errors.update(prev => ({ ...prev, username: usernameErr }));
      }
    }
    if (!data.email) {
      this.errors.update(prev => ({...prev, email: "Please provide your email!"})) ;
    } else {
      const emailErr = validateEmail(data.email);
      if (emailErr) {
        this.errors.update(prev => ({ ...prev, email: emailErr })); 
      }
    }
    if (!data.password) {
      this.errors.update(prev => ({ ...prev, password: "Please provide your password!" }));
    } else {
      const passwordErr = validatePassword(data.password);
      if (passwordErr) {
        this.errors.update(prev => ({ ...prev, password: passwordErr }));
      }
    }
    if (!data.confirm_password || data.password !== data.confirm_password) {
      this.errors.update(prev => ({ ...prev, confirm_password: "Please confirm your password!" }));
    } 
        
    if (data.username && data.email && data.password && data.confirm_password && !this.isErrors()) {
      this.loadingState.set(true);
      
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password); 

      this.http.post<User>(`${BACKEND_URL}api/register/`, formData).pipe(
        catchError((error: HttpErrorResponse) => { 
          const res = error.error;   
          let newErr = null
          if (res && Array.isArray(res.message)) { 
            res.message.forEach((msg: string) => {
              if (msg.includes('Username')) {
                this.errors.update(prev => ({...prev, username: msg}));
              } else if (msg.includes('email')) {
                this.errors.update(prev => ({...prev, email: msg}));
              } else if (msg.includes('Password')) {
                this.errors.update(prev => ({...prev, password: msg}));
              } else {
                this.errors.update(prev => ({...prev, global: msg}));
              }
            }); 
            newErr = 'Validation error.'; 
          } else if (res && typeof res.message === 'string') {
            if (res.message.includes('Username')) {
              this.errors.update(prev => ({...prev, username: res.message}));
            } else if (res.message.includes('email')) {
              this.errors.update(prev => ({...prev, email: res.message}));
            } else if (res.message.includes('Password')) {
              this.errors.update(prev => ({...prev, password: res.message}));
            } else {
              this.errors.update(prev => ({...prev, global: res.message}));
            }   
            newErr = res.message
          } else {
            this.errors.update(prev => ({ ...prev, global: 'An unexpected error occurred.' }));
            newErr = 'An unexpected error occurred.'; 
          } 
          toastMessage(newErr, 'error', 1500 );
          setTimeout(() => { this.loadingState.set(false); }, 500);
          throw error;
      })).subscribe((res: User|null) => {
        if (res) {    
          this.values.update(prev => ({ username: null, email: null ,password: null, confirm_password: null }));
          toastMessage('Successfully registered!', 'success', 1000 ); 
          setTimeout(() => { toastMessage('Redirecting you to the login screen...', 'loading', 1000 ); }, 500);
          setTimeout(() => { this.loadingState.set(false); }, 1000);
          setTimeout(() => { this.router.navigate(['/login']); }, 1000); 
        }
      } 
      ); 
    } 
  }

  handleInputChangeUsername(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces 
    this.values.update(prev => ({ ...prev, username: value ? value : null }));
    this.errors.update(prev => ({ ...prev, username: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }
  handleInputChangeEmail(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces 
    this.values.update(prev => ({ ...prev, email: value ? value : null }));
    this.errors.update(prev => ({ ...prev, email: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }
  handleInputChangePassword(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces 
    this.values.update(prev => ({ ...prev, password: value ? value : null }));
    this.errors.update(prev => ({ ...prev, password: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }
  handleInputChangeConfirmPassword(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces 
    this.values.update(prev => ({ ...prev, confirm_password: value ? value : null }));
    this.errors.update(prev => ({ ...prev, confirm_password: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }
  clearUsername() {
    this.values.update(prev => ({ ...prev, username: null }));
  }
  clearEmail() {
    this.values.update(prev => ({ ...prev, email: null }));
  }
  clearPassword() {
    this.values.update(prev => ({ ...prev, password: null }));
  }
  clearConfirmPassword() {
    this.values.update(prev => ({ ...prev, confirm_password: null }));
  }


}

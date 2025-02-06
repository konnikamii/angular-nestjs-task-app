import { Component, computed, inject, signal } from '@angular/core'; 
import { Router  } from '@angular/router';
import { SideLinesComponent } from "../../components/side-lines/side-lines.component";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ThemeService } from '../../services/theme.service'; 
import { BACKEND_URL, btnClassPrimaryDarkBlue } from '../../utils_other/defaults';
import { rippleAnimation, toastMessage, validateEmail  } from '../../utils_other/helperFunctions';
import { ContactErrors, ContactValues  } from '../../utils_other/types';

import { CustomInputComponent } from "../../components/custom-input/custom-input.component";
import { catchError } from 'rxjs';
 
@Component({
  selector: 'app-contact',
  imports: [  SideLinesComponent, CustomInputComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  themeService = inject(ThemeService);
  router = inject(Router);
  http = inject(HttpClient); 

  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);
  
  values = signal<ContactValues>({ name: null, email: null ,subject: null, message: null });
  errors =  signal<ContactErrors>({ name: null, email: null ,subject: null, message: null, global: null })
  loadingState = signal(false);
  isErrors = computed(() => this.errors().name || this.errors().email || this.errors().subject || this.errors().message || this.errors().global); 
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
    if (!data.name) {
      this.errors.update(prev => ({...prev, name: "Please provide your name!"})) ;
    }  
    if (!data.email) {
      this.errors.update(prev => ({...prev, email: "Please provide your email!"})) ;
    } else {
      const emailErr = validateEmail(data.email);
      if (emailErr) {
        this.errors.update(prev => ({ ...prev, email: emailErr })); 
      }
    }
    if (!data.subject) {
      this.errors.update(prev => ({ ...prev, subject: "Please provide a subject!" }));
    }  
    if (!data.message ) {
      this.errors.update(prev => ({ ...prev, message: "Please provide a message!" }));
    } 
        
    if (data.name && data.email && data.subject && data.message && !this.isErrors()) {
      this.loadingState.set(true);
      
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('subject', data.subject); 
      formData.append('message', data.message); 

      this.http.post<{detail: string}>(`${BACKEND_URL}api/contact/`, formData).pipe(
        catchError((error: HttpErrorResponse) => { 
          const res = error.error;  
          console.log(res)
          let newErr = null
          if (res && Array.isArray(res.message)) { 
            res.message.forEach((msg: string) => {
              if (msg.includes('name')) {
                this.errors.update(prev => ({...prev, name: msg}));
              } else if (msg.includes('email')) {
                this.errors.update(prev => ({...prev, email: msg}));
              } else if (msg.includes('subject')) {
                this.errors.update(prev => ({...prev, subject: msg}));
              } else {
                this.errors.update(prev => ({...prev, global: msg}));
              }
            }); 
            newErr = 'Validation error.'; 
          } else if (res && typeof res.message === 'string') {
            if (res.message.includes('name')) {
              this.errors.update(prev => ({...prev, name: res.message}));
            } else if (res.message.includes('email')) {
              this.errors.update(prev => ({...prev, email: res.message}));
            } else if (res.message.includes('subject')) {
              this.errors.update(prev => ({...prev, subject: res.message}));
            } else {
              this.errors.update(prev => ({...prev, global: res.message}));
            }  
            newErr = res.message; 
          } else {
            this.errors.update(prev => ({ ...prev, global: 'An unexpected error occurred.' })); 
            newErr = 'An unexpected error occurred.'; 
          } 
          toastMessage(newErr, 'error', 1500 ); 
          setTimeout(() => { this.loadingState.set(false); }, 500);
          throw error;
      })).subscribe((res: {detail: string}|null) => {
        if (res) {    
          this.values.update(prev => ({ name: null, email: null ,subject: null, message: null }))
          toastMessage(res.detail, 'success', 1500 );  
          setTimeout(() => { this.loadingState.set(false); }, 1000); 
        }
      } 
      ); 
    } 
  }

  handleInputChangeName(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value 
    this.values.update(prev => ({ ...prev, name: value ? value : null }));
    this.errors.update(prev => ({ ...prev, name: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }
  handleInputChangeEmail(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces 
    this.values.update(prev => ({ ...prev, email: value ? value : null }));
    this.errors.update(prev => ({ ...prev, email: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }
  handleInputChangeSubject(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value 
    this.values.update(prev => ({ ...prev, subject: value ? value : null }));
    this.errors.update(prev => ({ ...prev, subject: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }
  handleInputChangeMessage(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value 
    this.values.update(prev => ({ ...prev, message: value ? value : null }));
    this.errors.update(prev => ({ ...prev, message: null }));
    this.errors.update(prev => ({ ...prev, global: null }));
  }
  clearName() {
    this.values.update(prev => ({ ...prev, name: null }));
  }
  clearEmail() {
    this.values.update(prev => ({ ...prev, email: null }));
  }
  clearSubject() {
    this.values.update(prev => ({ ...prev, subject: null }));
  }
  clearMessage() {
    this.values.update(prev => ({ ...prev, message: null }));
  }


}

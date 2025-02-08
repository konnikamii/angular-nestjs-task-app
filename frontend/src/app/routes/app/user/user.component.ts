import { Component, computed, inject, signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { UserService } from '../../../services/user.service';
import { passwordUpdateValues, passwordUpdateErrors, User } from '../../../utils_other/types';
import { rippleAnimation, toastMessage, validatePassword } from '../../../utils_other/helperFunctions';
import { ThemeService } from '../../../services/theme.service';
import { CustomInputComponent } from "../../../components/custom-input/custom-input.component";
import { BACKEND_URL, btnClassPrimaryDarkBlue } from '../../../utils_other/defaults';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs';
 
@Component({
  selector: 'app-user',
  imports: [CustomInputComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  themeService = inject(ThemeService);
  userService = inject(UserService)
  queryClient = inject(QueryClient) 
  http = inject(HttpClient); 

  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);

  ngOnInit() { 
    this.themeService.theme$.subscribe(newTheme => {
      this.theme.set(newTheme);
      this.isLight.set(this.themeService.isLight);
    });
  }

  query = injectQuery(() => ({
    queryKey: ['user'],
    queryFn: () => this.userService.getUser(), 
  }))

  values = signal<passwordUpdateValues>({ old_password: null,new_password: null,confirm_password: null});
  errors =  signal<passwordUpdateErrors>({ old_password: null,new_password: null,confirm_password: null,global: null, })
  loadingState = signal(false)
  isErrors = computed(() => this.errors().old_password || this.errors().new_password || this.errors().confirm_password || this.errors().global); 
  isDisabled = computed(() => this.isErrors() || this.loadingState());
  btnClassPrimaryDarkBlue = btnClassPrimaryDarkBlue


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
      if (!data.old_password) {
        this.errors.update(prev => ({...prev, old_password: "Please provide your old password!"})) ;
      } 
      if (!data.new_password) {
        this.errors.update(prev => ({ ...prev, new_password: "Please provide your new password!" }));
      } else {
        const passwordErr = validatePassword(data.new_password);
        if (passwordErr) {
          this.errors.update(prev => ({ ...prev, new_password: passwordErr }));
        }
      }
      if (!data.confirm_password || data.new_password !== data.confirm_password) {
        this.errors.update(prev => ({ ...prev, confirm_password: "Please confirm your password!" }));
      } 
          
      if (data.old_password && data.new_password && data.confirm_password && !this.isErrors()) {
        this.loadingState.set(true);
        
        const formData = new FormData(); 
        formData.append('old_password', data.old_password); 
        formData.append('new_password', data.new_password);  
        this.http.put<{ detail: string }>(`${BACKEND_URL}api/change-password/`, formData, {headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}}).pipe(
          catchError((error: HttpErrorResponse) => { 
            const res = error.error;   
            let newErr = null
            if (res && Array.isArray(res.message)) { 
              res.message.forEach((msg: string) => {
                if (msg.includes('Old')) {
                  this.errors.update(prev => ({...prev, old_password: msg}));
                } else if (msg.includes('least') || msg.includes('must')) {
                  this.errors.update(prev => ({...prev, new_password: msg}));
                } else {
                  this.errors.update(prev => ({...prev, global: msg}));
                }
              }); 
              newErr = 'Validation error.'; 
            } else if (res && typeof res.message === 'string') {
              if (res.message.includes('Old')) {
                this.errors.update(prev => ({...prev, old_password: res.message}));
              } else if (res.message.includes('least') || res.message.includes('must')) {
                this.errors.update(prev => ({...prev, new_password: res.message}));
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
        })).subscribe((res: { detail: string }) => {
          if (res) {     
            this.values.set({ old_password: null,new_password: null,confirm_password: null});
            this.errors.set({ old_password: null,new_password: null,confirm_password: null,global: null, });
            toastMessage(res.detail, 'success', 1000 );  
            setTimeout(() => { this.loadingState.set(false); }, 1000); 
            this.queryClient.invalidateQueries({ queryKey: ['user'] })
          }
        } 
        ); 
      } 
  }
   
  changeField(event: Event, type: 'old_password' | 'new_password' | 'confirm_password') {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\s+/g, ''); // removes whitespaces  
    this.values.update(prev => ({ ...prev, [type]: value ? value : null }));
    this.errors.update(prev => ({ ...prev, [type]: null, global: null })); 
  }
  clearField(type: 'old_password' | 'new_password' | 'confirm_password') {
    this.values.update(prev => ({ ...prev, [type]: null }));
    this.errors.update(prev => ({ ...prev, [type]: null }));
  }
}

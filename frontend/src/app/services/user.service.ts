import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom } from 'rxjs';
import { User, UserTasks } from '../utils_other/types';
import { BACKEND_URL } from '../utils_other/defaults';
import { toastMessage } from '../utils_other/helperFunctions';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getUser(): Promise<User> {
    return lastValueFrom(
      this.http
        .get<User>(`${BACKEND_URL}api/user/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              toastMessage('Session Expired', 'error', 1500);
              localStorage.removeItem('access_token');
              window.location.href = '/';
            }
            throw error;
          })
        )
    );
  }
  getUsers(): Promise<UserTasks[]> {
    return lastValueFrom(
      this.http
        .post<UserTasks[]>(
          `${BACKEND_URL}api/users/`,
          { type: 'user_tasks' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              toastMessage('Session Expired', 'error', 1500);
              localStorage.removeItem('access_token');
              window.location.href = '/';
            }
            throw error;
          })
        )
    );
  }

  constructor() {}
}

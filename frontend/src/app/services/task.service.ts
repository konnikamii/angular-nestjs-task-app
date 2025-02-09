import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom, catchError } from 'rxjs';
import { BACKEND_URL } from '../utils_other/defaults';
import { Task, TasksGet, TasksIn, User } from '../utils_other/types';
import { toastMessage } from '../utils_other/helperFunctions';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);

  getTasksPaginated({
    page,
    page_size,
    sort_by,
    sort_type,
  }: TasksGet): Promise<TasksIn> {
    return lastValueFrom(
      this.http
        .post<TasksIn>(
          `${BACKEND_URL}api/tasks/`,
          { page, page_size, sort_by, sort_type },
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

  getTask(id: number | null): Promise<Task> {
    return lastValueFrom(
      this.http
        .get<Task>(`${BACKEND_URL}api/task/${id}`, {
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
  constructor() {}
}

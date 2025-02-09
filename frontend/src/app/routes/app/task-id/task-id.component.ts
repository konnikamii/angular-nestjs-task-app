import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  injectQuery,
  keepPreviousData,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { TaskService } from '../../../services/task.service';
import { ThemeService } from '../../../services/theme.service';
import { DatePipe } from '@angular/common';
import {
  Task,
  TaskCreateValues,
  TaskUpdateErrors,
  TaskUpdateValues,
} from '../../../utils_other/types';
import { BACKEND_URL } from '../../../utils_other/defaults';
import {
  rippleAnimation,
  toastMessage,
} from '../../../utils_other/helperFunctions';
import { catchError } from 'rxjs';
import { CustomInputComponent } from '../../../components/custom-input/custom-input.component';
import { CustomSelectComponent } from '../../../components/custom-select/custom-select.component';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-id',
  imports: [
    DatePipe,
    CustomInputComponent,
    CustomSelectComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './task-id.component.html',
  styleUrl: './task-id.component.scss',
})
export class TaskIdComponent implements OnInit {
  themeService = inject(ThemeService);
  taskService = inject(TaskService);
  queryClient = inject(QueryClient);
  http = inject(HttpClient);
  route = inject(ActivatedRoute);
  router = inject(Router);
  datePipe = inject(DatePipe);

  taskId: string | null = null;
  id = signal<string | null>(this.route.snapshot.paramMap.get('id'));

  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);
  loadingState = signal(false);
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.taskId = params.get('id');
      // Fetch the task details using the taskId
    });
    this.themeService.theme$.subscribe((newTheme) => {
      this.theme.set(newTheme);
      this.isLight.set(this.themeService.isLight);
    });
  }

  query = injectQuery(() => ({
    queryKey: ['tasks', this.id()],
    queryFn: () => this.taskService.getTask(parseInt(this.id() ?? '')),
    placeholderData: keepPreviousData,
  }));

  values = signal<TaskUpdateValues>({
    title: this.query.data()?.title ?? '',
    description: this.query.data()?.description ?? '',
    completed: this.query.data()?.completed ?? true,
    due_date: this.query.data()?.due_date ?? null,
  });
  errors = signal<TaskUpdateErrors>({
    title: null,
    description: null,
    completed: null,
    due_date: null,
    global: null,
  });
  isErrors = computed(
    () =>
      this.errors().title ||
      this.errors().description ||
      this.errors().completed ||
      this.errors().due_date ||
      this.errors().global
  );
  isDisabled = computed(() => this.isErrors() || this.loadingState());

  constructor() {
    effect(() => {
      const data = this.query.data();
      if (data) {
        this.values.set({
          title: data.title ?? '',
          description: data.description ?? '',
          completed: data.completed ?? true,
          due_date: data.due_date ?? null,
        });
      }
    });
  }
  handleClickSubmit(event: MouseEvent) {
    rippleAnimation(event, this.isLight());
    this.handleSubmit();
  }
  handleEnterSubmit(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handleSubmit() {
    const data = this.values();
    if (!data.title) {
      this.errors.update((prev) => ({
        ...prev,
        title: 'Please provide a title!',
      }));
    }
    if (!data.description) {
      this.errors.update((prev) => ({
        ...prev,
        description: 'Please provide a description!',
      }));
    }

    if (data.title && data.description && !this.isErrors()) {
      this.loadingState.set(true);

      this.http
        .put<Task>(`${BACKEND_URL}api/task/${this.id()}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            const res = error.error;
            let newErr = null;
            if (res && typeof res.message === 'string') {
              newErr = res.message;
            } else {
              this.errors.update((prev) => ({
                ...prev,
                global: 'An unexpected error occurred.',
              }));
              newErr = 'An unexpected error occurred.';
            }
            toastMessage(newErr, 'error', 1500);
            setTimeout(() => {
              this.loadingState.set(false);
            }, 500);
            throw error;
          })
        )
        .subscribe((res: Task) => {
          if (res) {
            toastMessage('Successfully updated your task!', 'success', 1000);
            setTimeout(() => {
              this.loadingState.set(false);
            }, 1000);
            this.queryClient.invalidateQueries({ queryKey: ['tasks'] });
          }
        });
    }
  }

  deleteTask() {
    this.loadingState.set(true);

    this.http
      .delete<Task>(`${BACKEND_URL}api/task/${this.id()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const res = error.error;
          let newErr = null;
          if (res && typeof res.message === 'string') {
            newErr = res.message;
          } else {
            newErr = 'An unexpected error occurred.';
          }
          toastMessage(newErr, 'error', 1500);
          setTimeout(() => {
            this.loadingState.set(false);
          }, 500);
          throw error;
        })
      )
      .subscribe((res: Task) => {
        if (res) {
          toastMessage('Successfully deleted task', 'success', 1000);
          setTimeout(() => {
            this.loadingState.set(false);
          }, 1000);
          this.queryClient.invalidateQueries({ queryKey: ['tasks'] });
          this.router.navigate(['/app/tasks']);
        }
      });
  }

  changeField(event: Event, type: 'title' | 'description' | 'due_date') {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.values.update((prev) => ({ ...prev, [type]: value ? value : null }));
    this.errors.update((prev) => ({ ...prev, [type]: null, global: null }));
  }
  clearField(type: 'title' | 'description' | 'due_date') {
    this.values.update((prev) => ({ ...prev, [type]: null }));
    this.errors.update((prev) => ({ ...prev, [type]: null }));
  }
  setCompleted(completed_string: string) {
    const completed = completed_string === 'true';
    this.values.update((prev) => ({ ...prev, completed }));
  }
  setDuedate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const formattedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
      this.values.update((prev) => ({ ...prev, due_date: formattedDate }));
    }
  }
}

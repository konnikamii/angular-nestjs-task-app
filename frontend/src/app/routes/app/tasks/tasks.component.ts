import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { QueryClient, injectQuery, keepPreviousData } from '@tanstack/angular-query-experimental';
import { ThemeService } from '../../../services/theme.service';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { SortByType, SortTypeType, Task, TaskCreateErrors, TaskCreateValues, TasksGet, TasksIdCreate } from '../../../utils_other/types';
import { DatePipe } from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CustomPaginatorComponent } from "../../../components/custom-paginator/custom-paginator.component";
import { CustomSelectComponent } from "../../../components/custom-select/custom-select.component";
import { BACKEND_URL, btnClassPrimaryDarkBlue } from '../../../utils_other/defaults';
import { catchError } from 'rxjs';
import { rippleAnimation, toastMessage } from '../../../utils_other/helperFunctions';
import { CustomModalComponent } from "../../../components/custom-modal/custom-modal.component";
import { CustomInputComponent } from "../../../components/custom-input/custom-input.component";
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe, MatPaginatorModule, CustomPaginatorComponent, CustomSelectComponent, CustomModalComponent, CustomInputComponent,MatFormFieldModule, MatInputModule, MatDatepickerModule], 
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent { 
  themeService = inject(ThemeService);
  taskService = inject(TaskService)
  queryClient = inject(QueryClient) 
  http = inject(HttpClient); 
  datePipe = inject(DatePipe);

  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);
  isModalOpen = signal(false);

  ngOnInit() { 
    this.themeService.theme$.subscribe(newTheme => {
      this.theme.set(newTheme);
      this.isLight.set(this.themeService.isLight);
    });
  }
 
  values = signal<TasksGet>({ page: 1, page_size: 12, sort_by: 'due_date', sort_type: 'asc' })  
  taskCreate = signal<TaskCreateValues>({ title: null, description: null, completed: true, due_date: null }); 
  taskCreateErrors = signal<TaskCreateErrors>({ title: null, description: null, completed: null, due_date: null, global: null }); 
  sortByOptions = [
    { value: 'title', title: 'Title' },
    { value: 'completed', title: 'Completed' },
    { value: 'due_date', title: 'Due Date' },
    { value: 'created_at', title: 'Created At' },
    { value: 'updated_at', title: 'Updated At' },
  ] 
  sortTypeOptions = [
    { value: 'asc', title: 'Ascending' },
    { value: 'desc', title: 'Descending' }, 
  ] 
  query = injectQuery(() => ({
    queryKey: ['tasks', this.values()],
    queryFn: () => this.taskService.getTasksPaginated(this.values()), 
    placeholderData: keepPreviousData
  }))
  loadingState = signal(false)
  isErrors = computed(() => this.taskCreateErrors().title || this.taskCreateErrors().description || this.taskCreateErrors().completed || this.taskCreateErrors().due_date || this.taskCreateErrors().global); 
  isDisabled = computed(() =>  this.isErrors() || this.loadingState() );
  btnClassPrimaryDarkBlue = btnClassPrimaryDarkBlue

  toggleTasksModal() { 
    this.isModalOpen.set(!this.isModalOpen());
  }
  navigateToTask(id: number) {
  }
  deleteTask(id: number) {
    this.loadingState.set(true);
      
    this.http.delete<Task>(`${BACKEND_URL}api/task/${id}`, {headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}}).pipe(
      catchError((error: HttpErrorResponse) => { 
        const res = error.error;   
        let newErr = null
        if (res && typeof res.message === 'string') { 
          newErr = res.message
        } else { 
          newErr = 'An unexpected error occurred.'; 
        } 
        toastMessage(newErr, 'error', 1500 );
        setTimeout(() => { this.loadingState.set(false); }, 500);
        throw error;
    })).subscribe((res: Task) => {
      if (res) {      
        toastMessage("Successfully deleted task", 'success', 1000 );  
        setTimeout(() => { this.loadingState.set(false); }, 1000); 
        this.queryClient.invalidateQueries({ queryKey: ['tasks'] })
      }
    } 
    ); 
  }
  setCurrentPage(page: number) { 
    this.values.update(prev => ({ ...prev, page }))
  }
  setPageSize(page_size: number) { 
    this.values.update(prev => ({ ...prev, page_size }))
  }
  setSortBy(sort_by_string: string) {
    const sort_by = sort_by_string as SortByType 
    this.values.update(prev => ({ ...prev, sort_by }))
  }
  setSortType(sort_type_string: string) {
    const sort_type = sort_type_string as SortTypeType 
    this.values.update(prev => ({ ...prev, sort_type }))
  }
  setCompleted(completed_string: string) {
    const completed  = completed_string === 'true' 
    this.taskCreate.update(prev => ({ ...prev, completed }))
  }
  setDuedate(event: MatDatepickerInputEvent<Date>) { 
    if (event.value) {
      const formattedDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
      this.taskCreate.update(prev => ({ ...prev, due_date: formattedDate }));
    }
  }
  
  changeField(event: Event, type: 'title' | 'description' | 'due_date') {
    const target = event.target as HTMLInputElement;
    const value = target.value  
    this.taskCreate.update(prev => ({ ...prev, [type]: value ? value : null }));
    this.taskCreateErrors.update(prev => ({ ...prev, [type]: null, global: null })); 
  }
  clearField(type: 'title' | 'description' | 'due_date') {
    this.taskCreate.update(prev => ({ ...prev, [type]: null }));
    this.taskCreateErrors.update(prev => ({ ...prev, [type]: null }));
  }
  handleEnterSubmit(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }
  handleClickSubmit(e: MouseEvent) { 
    rippleAnimation(e, this.isLight(), 1300);
    this.handleSubmit(); 
  }
  handleSubmit() {
    const data = this.taskCreate();  
    if (!data.title) {
      this.taskCreateErrors.update(prev => ({...prev, title: "Please provide a title!"})) ;
    }   
    if (!data.description) {
      this.taskCreateErrors.update(prev => ({...prev, description: "Please provide a description!"})) ;
    }   

    if (data.title && data.description && !this.isErrors()) {
      this.loadingState.set(true);
       

      this.http.post<Task>(`${BACKEND_URL}api/task/`, this.taskCreate(), {headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}}).pipe(
        catchError((error: HttpErrorResponse) => { 
          const res = error.error;   
          let newErr = null
          if (res && typeof res.message === 'string') { 
            newErr = res.message
          } else {
            this.taskCreateErrors.update(prev => ({ ...prev, global: 'An unexpected error occurred.' }));
            newErr = 'An unexpected error occurred.'; 
          } 
          toastMessage(newErr, 'error', 1500 );
          setTimeout(() => { this.loadingState.set(false); }, 500);
          throw error;
      })).subscribe((res: Task ) => {
        if (res) {    
          this.taskCreate.update(prev => ({ title: null, description: null, completed: true, due_date: null }));
          toastMessage('Successfully created a task!', 'success', 1000 );  
          setTimeout(() => { this.loadingState.set(false); }, 1000); 
          this.isModalOpen.set(false)  
          this.queryClient.invalidateQueries({ queryKey: ['tasks'] })
        }
      } 
      ); 
    } 
  }
}

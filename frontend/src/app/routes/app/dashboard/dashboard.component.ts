import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  QueryClient,
  injectQuery,
  keepPreviousData,
} from '@tanstack/angular-query-experimental';
import { ThemeService } from '../../../services/theme.service';
import { TaskService } from '../../../services/task.service';
import { Task, TasksGet } from '../../../utils_other/types';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  themeService = inject(ThemeService);
  taskService = inject(TaskService);
  userService = inject(UserService);
  queryClient = inject(QueryClient);
  http = inject(HttpClient);
  datePipe = inject(DatePipe);
  router = inject(Router);

  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);
  isModalOpen = signal(false);

  ngOnInit() {
    this.themeService.theme$.subscribe((newTheme) => {
      this.theme.set(newTheme);
      this.isLight.set(this.themeService.isLight);
    });
    console.log(this.queryUser.data());
  }
  loadingState = signal(false);
  queryUser = injectQuery(() => ({
    queryKey: ['user'],
    queryFn: () => this.userService.getUser(),
    placeholderData: keepPreviousData,
  }));
  queryUsers = injectQuery(() => ({
    queryKey: ['users'],
    queryFn: () => this.userService.getUsers(),
    placeholderData: keepPreviousData,
  }));
  upcomingTasksDict: TasksGet = {
    page: 1,
    page_size: 25,
    sort_by: 'due_date',
    sort_type: 'asc',
  };
  queryUpcomingTasks = injectQuery(() => ({
    queryKey: ['tasks', this.upcomingTasksDict],
    queryFn: () => this.taskService.getTasksPaginated(this.upcomingTasksDict),
    placeholderData: keepPreviousData,
  }));
  completedTasksDict: TasksGet = {
    page: 1,
    page_size: 3,
    sort_by: 'completed',
    sort_type: 'desc',
  };
  queryCompletedTasks = injectQuery(() => ({
    queryKey: ['tasks', this.completedTasksDict],
    queryFn: () => this.taskService.getTasksPaginated(this.completedTasksDict),
    placeholderData: keepPreviousData,
  }));
  recentTasksDict: TasksGet = {
    page: 1,
    page_size: 3,
    sort_by: 'created_at',
    sort_type: 'desc',
  };
  queryRecentTasks = injectQuery(() => ({
    queryKey: ['tasks', this.recentTasksDict],
    queryFn: () => this.taskService.getTasksPaginated(this.recentTasksDict),
    placeholderData: keepPreviousData,
  }));
  sortedUsers = computed(() => {
    const users = this.queryUsers.data();
    return users
      ? [...users].sort((a, b) => b.tasks.length - a.tasks.length)
      : [];
  });

  filteredCompletedTasks = computed(() => {
    const completedTasks = this.queryCompletedTasks.data();
    return completedTasks
      ? completedTasks.tasks.filter((task: Task) => task.completed)
      : [];
  });

  filteredUpcomingTasks = computed(() => {
    const upcomingTasks = this.queryUpcomingTasks.data();
    const today = new Date();
    return upcomingTasks
      ? upcomingTasks.tasks
          .filter(
            (task: Task) =>
              task.due_date &&
              new Date(task.due_date) >= today &&
              !task.completed
          )
          .sort((a, b) => {
            const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
            const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
            return dateA - dateB;
          })
          .slice(0, 3)
      : [];
  });

  navigateToTask(id: number) {
    this.router.navigate(['/app/tasks', id]);
  }
}

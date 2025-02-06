// filepath: /d:/Coding/Repos/angular-nestjs-task-app/frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./routes/home/home.component').then((m) => m.HomeComponent),
      }, 
      {
        path: '',
        component: AuthLayoutComponent,
        children: [
          {
            path: 'login',
            loadComponent: () =>
              import('./routes/login/login.component').then((m) => m.LoginComponent),
          },
          {
            path: 'register',
            loadComponent: () =>
              import('./routes/register/register.component').then(
                (m) => m.RegisterComponent
              ),
          },
        ],
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./routes/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'tos',
        loadComponent: () =>
          import('./routes/tos/tos.component').then((m) => m.TosComponent),
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('./routes/privacy/privacy.component').then((m) => m.PrivacyComponent),
      },
    ],
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./routes/app/index/index.component').then(
            (m) => m.IndexComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./routes/app/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./routes/app/tasks/tasks.component').then(
            (m) => m.TasksComponent
          ),
      },
      {
        path: 'user',
        loadComponent: () =>
          import('./routes/app/user/user.component').then(
            (m) => m.UserComponent
          ),
      },
    ],
  },
];
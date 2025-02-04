// filepath: /d:/Coding/Repos/angular-nestjs-task-app/frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';

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
      {
        path: 'contact',
        loadComponent: () =>
          import('./routes/contact/contact.component').then((m) => m.ContactComponent),
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
    ],
  },
];
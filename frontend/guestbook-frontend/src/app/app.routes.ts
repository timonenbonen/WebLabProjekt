import {Routes} from '@angular/router';
import {LoginComponent} from './features/auth/login/login.component';
import {RegisterComponent} from './features/auth/register/register.component';
import {inject} from '@angular/core';
import {AuthGuard} from './guards/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'guestbook/:id',
    loadComponent: () => import('./features/guestbook-details/guestbook-details.component')
      .then(m => m.GuestbookDetailsComponent)
  },
  {
    path: 'guestbook-share/:shareLink',
    loadComponent: () => import('./features/guestbook-share/guestbook-share.component')
      .then(m => m.GuestbookShareComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [() => inject(AuthGuard).canActivate()],
  },

  {path: '**', redirectTo: 'login'},
];

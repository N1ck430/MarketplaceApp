import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'user/login',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
        canActivate: [authGuard],
    },
    {
        path: 'home2',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
        canActivate: [authGuard],
    },
    {
        path: 'user',
        loadComponent: () => import('./pages/user/user.component').then((m) => m.UserComponent),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/user/login/login.component').then((m) => m.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () => import('./pages/user/register/register.component').then((m) => m.RegisterComponent),
            },
            {
                path: 'confirm-email/:userId/:code',
                loadComponent: () => import('./pages/user/confirm-email/confirm-email.component').then((m) => m.ConfirmEmailComponent),
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./pages/user/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
            },
            {
                path: 'forgot-password/:userId/:code',
                loadComponent: () => import('./pages/user/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
            },
        ],
    },
    {
        path: 'user/:userSequenceId',
        loadComponent: () => import('./pages/user/details/details.component').then((m) => m.DetailsComponent),
    },
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        children: [
            {
                path: 'user-management',
                loadComponent: () => import('./pages/admin/user-management/user-management.component').then((m) => m.UserManagementComponent),
            },
            {
                path: 'software',
                loadComponent: () => import('./pages/software/software.component').then((m) => m.SoftwareComponent),
            },
            {
                path: 'software/:softwareId',
                loadComponent: () => import('./pages/software/software-details/software-details.component').then((m) => m.SoftwareDetailsComponent),
            },
        ],
    },
    {
        path: 'not-found',
        loadComponent: () => import('./pages/general/not-found/not-found.component').then((m) => m.NotFoundComponent),
    },
];

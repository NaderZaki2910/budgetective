import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // {
  //   path: 'folder/:id',
  //   loadComponent: () =>
  //     import('./folder/folder.page').then((m) => m.FolderPage),
  // },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'wallets',
    loadComponent: () =>
      import('./pages/wallets/wallets.page').then((m) => m.WalletsPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.page').then(
        (m) => m.CategoriesPage
      ),
    canActivate: [AuthGuard],
  },
];

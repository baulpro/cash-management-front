import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'clients',
        pathMatch: 'full'
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/client-list/client-list').then(m => m.ClientList)
      },
      {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/account-list/account-list').then(m => m.AccountList)
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transaction-list/transaction-list').then(m => m.TransactionList)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports').then(m => m.Reports)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

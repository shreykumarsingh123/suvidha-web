import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'language', loadComponent: () => import('./pages/language/language.component').then(m => m.LanguageComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'otp', loadComponent: () => import('./pages/auth/otp/otp.component').then(m => m.OtpComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'service/:id',
    loadComponent: () => import('./pages/services/service-detail/service-detail.component').then(m => m.ServiceDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'payment',
    loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'receipt',
    loadComponent: () => import('./pages/receipt/receipt.component').then(m => m.ReceiptComponent),
    canActivate: [authGuard]
  },
  // Admin route not implemented yet, redirect to welcome
  { path: 'admin', redirectTo: 'welcome' },
  { path: '**', redirectTo: 'welcome' }
];

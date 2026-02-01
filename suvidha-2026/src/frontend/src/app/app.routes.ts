import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },

  // Public Routes (No Header/Layout)
  { path: 'welcome', component: WelcomeComponent },
  { path: 'language', loadComponent: () => import('./pages/language/language.component').then(m => m.LanguageComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'otp', loadComponent: () => import('./pages/auth/otp/otp.component').then(m => m.OtpComponent) },

  // Protected Routes (With Header/Layout)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'provider-select',
        loadComponent: () => import('./pages/services/provider-select/provider-select.component').then(m => m.ProviderSelectComponent)
      },
      {
        path: 'consumer-input',
        loadComponent: () => import('./pages/services/consumer-input/consumer-input.component').then(m => m.ConsumerInputComponent)
      },
      {
        path: 'service/:id',
        loadComponent: () => import('./pages/services/service-detail/service-detail.component').then(m => m.ServiceDetailComponent)
      },
      {
        path: 'payment',
        loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent)
      },
      {
        path: 'receipt',
        loadComponent: () => import('./pages/receipt/receipt.component').then(m => m.ReceiptComponent)
      }
    ]
  },

  // Fallback
  { path: 'admin', redirectTo: 'welcome' },
  { path: '**', redirectTo: 'welcome' }
];

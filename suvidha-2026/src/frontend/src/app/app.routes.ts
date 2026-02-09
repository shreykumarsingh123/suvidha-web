import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LanguageComponent } from './pages/language/language.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { OtpComponent } from './pages/auth/otp/otp.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProviderSelectComponent } from './pages/services/provider-select/provider-select.component';
import { ConsumerInputComponent } from './pages/services/consumer-input/consumer-input.component';
import { ServiceDetailComponent } from './pages/services/service-detail/service-detail.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ReceiptComponent } from './pages/receipt/receipt.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },

  // Public Routes (No Header/Layout)
  { path: 'welcome', component: WelcomeComponent },
  { path: 'language', component: LanguageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'otp', component: OtpComponent },

  // Protected Routes (Dashboard with integrated header)
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin', component: DashboardComponent },
      { path: 'provider-select', component: ProviderSelectComponent },
      { path: 'consumer-input', component: ConsumerInputComponent },
      { path: 'service/:id', component: ServiceDetailComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'receipt', component: ReceiptComponent },
      { path: 'bills', loadComponent: () => import('./components/bills-list/bills-list.component').then(m => m.BillsListComponent) },
      { path: 'complaints', loadComponent: () => import('./components/complaint-form/complaint-form.component').then(m => m.ComplaintFormComponent) }
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'welcome' }
];

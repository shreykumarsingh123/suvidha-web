import { Component, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

declare const lucide: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);
  
  currentTime: string = '12:00';
  private clockInterval: any;
  private iconInitialized: boolean = false;

  ngAfterViewInit(): void {
    // Initialize Lucide icons
    this.initializeIcons();
    
    // Start clock
    this.updateClock();
    this.clockInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  private initializeIcons(): void {
    if (typeof lucide !== 'undefined' && !this.iconInitialized) {
      lucide.createIcons();
      this.iconInitialized = true;
    }
  }

  private updateClock(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  openService(type: string): void {
    // Navigate to provider selection with service type
    this.router.navigate(['/provider-select'], { queryParams: { type } });
  }

  navigateToPayment(): void {
    this.router.navigate(['/payment']);
  }

  trackRequest(): void {
    alert('Track Request feature coming soon!');
  }

  logout(): void {
    this.authService.logout();
  }
}


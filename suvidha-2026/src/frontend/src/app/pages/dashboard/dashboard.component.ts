import { Component, inject, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { IdleService } from '../../core/services/idle.service';

declare const lucide: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  authService = inject(AuthService);
  idleService = inject(IdleService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentTime: string = '12:00';
  private clockInterval: any;
  private iconInitialized: boolean = false;

  constructor() {
    // Setup effect to force change detection when idle timer updates
    effect(() => {
      // Access the signal to create dependency
      const time = this.idleService.remainingTime();
      // Force change detection when signal updates
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    // ✅ FIX #2: Start idle timer when dashboard loads
    this.idleService.startIdleTimer();
  }

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
    // ✅ FIX #6: Proper cleanup to prevent memory leaks
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
    this.cdr.detectChanges();
  }

  get remainingTime(): number {
    return this.idleService.remainingTime();
  }

  get showWarning(): boolean {
    return this.remainingTime <= 30;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Get username from current user or return default
   */
  get username(): string {
    // ✅ FIX #7: Use signal directly for consistency
    const user = this.authService.currentUser();
    return user?.username || 'Guest User';
  }

  /**
   * Get masked mobile number showing only last 4 digits
   * Format: ******1234
   */
  get maskedMobile(): string {
    // ✅ FIX #7: Use signal directly for consistency
    const user = this.authService.currentUser();
    const mobile = user?.mobileNumber || user?.mobile || '';
    if (mobile.length >= 4) {
      return '******' + mobile.slice(-4);
    }
    return '**********';
  }

  openService(type: string): void {
    // Handle municipal complaints separately
    if (type === 'muni') {
      this.router.navigate(['/complaints']);
      return;
    }
    // Navigate to provider selection with service type
    this.router.navigate(['/provider-select'], { queryParams: { type } });
  }

  navigateToPayment(): void {
    this.router.navigate(['/transaction-history']);
  }

  navigateToBills(): void {
    this.router.navigate(['/bills']);
  }

  navigateToComplaints(): void {
    this.router.navigate(['/complaints']);
  }

  trackRequest(): void {
    this.router.navigate(['/track-complaints']);
  }

  newConnection(): void {
    this.router.navigate(['/new-connection']);
  }

  navigateToDigiLocker(): void {
    // Show toast notification
    this.showToast('DigiLocker feature coming soon! No government API access yet :(');
    // Redirect back to dashboard after 2 seconds
    setTimeout(() => {
      // Already on dashboard, just refresh icons
      this.initializeIcons();
    }, 2000);
  }

  private showToast(message: string): void {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-enter font-bold text-lg';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 2500);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.authService.logout();
  }
}

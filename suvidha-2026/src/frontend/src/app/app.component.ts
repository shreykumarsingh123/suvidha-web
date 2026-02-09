import { Component, inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { IdleService } from './core/services/idle.service';

declare const lucide: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Smart Urban Virtual Interactive Digital Helpdesk Assistant (SUVIDHA) - 2026';
  
  authService = inject(AuthService);
  idleService = inject(IdleService);
  router = inject(Router);
  
  currentTime: string = '00:00';
  private clockInterval: any;
  private iconInitialized: boolean = false;

  // Expose signals for template
  currentUser = this.authService.currentUser;
  remainingTime = this.idleService.remainingTime;

  ngOnInit(): void {
    // Clock will start after view init
  }

  ngAfterViewInit(): void {
    this.initializeIcons();
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

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  shouldShowHeader(): boolean {
    const currentPath = this.router.url;
    // Don't show header on welcome, language, login, and otp pages
    const publicRoutes = ['/welcome', '/language', '/login', '/otp'];
    const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
    // Show header if not on public route AND user is logged in
    return !isPublicRoute && this.authService.isLoggedIn();
  }
}

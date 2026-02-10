import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class IdleService {
    private IDLE_LIMIT_SECONDS = 300; // STRICT 5 minutes - NO EXCEPTIONS
    private secondsRemaining = signal(this.IDLE_LIMIT_SECONDS);
    private intervalId: any;
    private authService = inject(AuthService);
    private router = inject(Router);
    private isRunning = false;

    // Expose signal for UI
    remainingTime = this.secondsRemaining.asReadonly();

    constructor() {
        // Timer will start explicitly after login
    }

    /**
     * Start strict 5-minute countdown timer
     * This timer WILL NOT STOP OR RESET until it reaches zero
     * User activity is COMPLETELY IGNORED
     */
    startIdleTimer() {
        // Prevent multiple timers
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        this.secondsRemaining.set(this.IDLE_LIMIT_SECONDS);

        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        console.log('🚨 STRICT AUTO-LOGOUT TIMER STARTED: 5:00 minutes');

        this.intervalId = setInterval(() => {
            const current = this.secondsRemaining();
            const newValue = current - 1;

            this.secondsRemaining.set(newValue);

            // Log warnings at key intervals
            if (newValue === 60) {
                console.warn('⚠️ 1 minute remaining until auto-logout');
            } else if (newValue === 30) {
                console.warn('⚠️ 30 seconds remaining until auto-logout');
            } else if (newValue === 10) {
                console.error('🚨 10 seconds remaining until auto-logout');
            }

            // STRICT ENFORCEMENT: Auto-logout at zero
            if (newValue <= 0) {
                console.error('❌ Auto-logout timer expired - logging out NOW');
                this.logout();
            }
        }, 1000);
    }

    /**
     * Stop the timer completely (called on logout)
     */
    stopIdleTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
        this.secondsRemaining.set(this.IDLE_LIMIT_SECONDS);
        console.log('✅ Auto-logout timer stopped');
    }

    /**
     * Force logout and cleanup
     */
    private logout() {
        this.stopIdleTimer();
        this.authService.logout();
        console.log('🚪 User auto-logged out after 5 minutes');
    }
}

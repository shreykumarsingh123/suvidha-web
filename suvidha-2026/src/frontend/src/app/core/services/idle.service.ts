import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class IdleService {
    private IDLE_LIMIT_SECONDS = 300; // 5 minutes
    private secondsRemaining = signal(this.IDLE_LIMIT_SECONDS);
    private intervalId: any;
    private authService = inject(AuthService);
    private router = inject(Router);

    // Expose signal for UI
    remainingTime = this.secondsRemaining.asReadonly();

    constructor() {
        // Don't start timer automatically - wait for explicit start
    }

    startIdleTimer() {
        // Don't setup listeners - timer should run continuously without reset
        this.startTimer();
    }

    private startTimer() {
        if (this.intervalId) clearInterval(this.intervalId);

        this.intervalId = setInterval(() => {
            this.secondsRemaining.update(v => v - 1);

            const val = this.secondsRemaining();

            if (val === 10) {
                // Warning triggers in UI via signal
            }

            if (val <= 0) {
                this.logout();
            }
        }, 1000);
    }

    resetTimer() {
        this.secondsRemaining.set(this.IDLE_LIMIT_SECONDS);
    }

    private logout() {
        clearInterval(this.intervalId);
        this.authService.logout();
    }

    private setupListeners() {
        const events = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, () => this.resetTimer());
        });
    }
}

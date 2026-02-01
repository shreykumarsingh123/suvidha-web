import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdleService } from '../../core/services/idle.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    template: `
    <header id="header" class="fixed top-0 left-0 w-full z-40 px-8 py-6 flex items-start justify-between pointer-events-none">
        <!-- Logo Area -->
        <div class="flex items-center gap-4 bg-white/90 backdrop-blur-md p-3 pr-8 rounded-full shadow-lg border border-white/50 pointer-events-auto">
            <div class="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner">
                🏛
            </div>
            <div>
                <h1 class="text-2xl font-black text-slate-800 tracking-tight leading-none">SUVIDHA</h1>
                <p class="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Citizen Helpdesk</p>
            </div>
        </div>

        <!-- Right Controls -->
        <div class="flex flex-col items-end gap-3 pointer-events-auto">
            <!-- Clock -->
            <div class="bg-white/90 backdrop-blur-md px-5 py-2 rounded-full shadow-lg border border-white/50 text-slate-700 font-mono font-bold text-lg flex items-center gap-3">
                <span>{{ currentTime | date:'shortTime' }}</span>
                <div class="w-px h-4 bg-slate-300"></div>
                <!-- Idle Timer -->
                <div class="flex items-center gap-2 text-sm" [ngClass]="{'text-red-600': isLowTime()}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span id="header-timer">{{ formattedRemainingTime() }}</span>
                </div>
            </div>
            
            <!-- User Profile (If Logged In) -->
            <div class="bg-indigo-600 text-white px-5 py-2 rounded-full shadow-lg shadow-indigo-200 flex items-center gap-3 animate-enter">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">AS</div>
                <div>
                    <p class="text-xs font-medium text-indigo-100 uppercase tracking-wider">Welcome</p>
                    <p class="font-bold leading-none">Arjun Sharma</p>
                </div>
            </div>
        </div>
    </header>
  `
})
export class HeaderComponent {
    idleService = inject(IdleService);
    currentTime = new Date();

    constructor() {
        setInterval(() => {
            this.currentTime = new Date();
        }, 1000);
    }

    isLowTime = computed(() => this.idleService.remainingTime() < 60);

    formattedRemainingTime = computed(() => {
        const total = this.idleService.remainingTime();
        const m = Math.floor(total / 60).toString().padStart(2, '0');
        const s = (total % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    });
}

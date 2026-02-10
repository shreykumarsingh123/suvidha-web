import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IdleService } from '../../core/services/idle.service';

@Component({
    selector: 'app-welcome',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="welcome" class="screen active bg-hexagon justify-center items-center relative overflow-hidden pb-32 w-full h-screen flex">
        <div class="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/50 to-transparent"></div>
        
        <!-- Hidden Admin Button (double click to access) -->
        <div class="absolute top-0 right-0 w-24 h-24 z-50 cursor-default" (dblclick)="navigateTo('admin')"></div>

        <div class="relative z-10 flex flex-col items-center text-center p-8 max-w-5xl w-full">
            <div class="mb-10 relative">
                <div class="absolute inset-0 bg-blue-500 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                <div class="w-48 h-48 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center shadow-2xl relative">
                    <div class="w-36 h-36 rounded-full border border-white/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                    </div>
                </div>
            </div>
            
            <div class="space-y-4 mb-16 text-white flex flex-col items-center">
                <div class="px-8 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md mb-2 shadow-lg">
                    <h2 class="text-xs font-bold tracking-[0.2em] text-blue-100 uppercase">GOVERNMENT OF INDIA</h2>
                </div>
                <h1 class="text-7xl md:text-9xl font-black tracking-tight drop-shadow-xl bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent transform scale-y-110">SUVIDHA</h1>
                <p class="text-xl md:text-2xl text-blue-200 font-light tracking-wide opacity-90">Unified Civic Services Kiosk</p>
            </div>
            
            <button (click)="navigateTo('language')" class="btn-water group relative bg-white text-[#0f172a] text-2xl font-bold px-24 py-6 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 active:scale-95 flex items-center gap-4 z-50 cursor-pointer">
                <span>Touch to Start</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
        </div>
        
        <!-- Footer -->
        <div class="absolute bottom-0 w-full bg-[#020617]/90 backdrop-blur-xl border-t border-white/10 h-auto py-4 flex items-center justify-between px-10 z-20 text-white">
            <div class="flex items-center gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" class="h-10 w-auto invert opacity-90" alt="Emblem">
                <div class="text-left border-l border-white/20 pl-4">
                    <div class="text-[10px] uppercase tracking-widest text-blue-300">Ministry of</div>
                    <div class="text-base font-bold leading-none">Housing & Urban Affairs</div>
                </div>
            </div>
            <div class="hidden md:flex flex-col items-center text-white/50 text-xs">
                <span class="uppercase tracking-[0.2em] mb-1 font-semibold">Powered By</span>
                <span class="font-bold text-white text-sm tracking-wide">Smart City Mission • C-DAC</span>
            </div>
            <div class="text-right">
                <div class="text-[10px] text-white/50 uppercase tracking-widest mb-1 font-semibold">System Status</div>
                <div class="flex items-center gap-2 justify-end">
                    <div class="flex gap-1.5">
                        <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                        <div class="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>
                    </div>
                    <span class="text-sm font-bold text-white/90">Ready</span>
                </div>
            </div>
        </div>
    </div>
  `
})
export class WelcomeComponent implements OnInit {
    private router: Router;
    private idleService: IdleService;

    constructor() {
        this.router = inject(Router);
        this.idleService = inject(IdleService);
    }

    ngOnInit() {
        // Idle timer starts automatically after login
    }

    navigateTo(path: string) {
        this.router.navigate([path]);
    }
}


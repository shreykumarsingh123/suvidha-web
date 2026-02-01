import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="dashboard" class="screen active bg-slate-100 overflow-y-auto h-screen w-full flex flex-col">
        <!-- Center Content Container -->
        <div class="flex-1 px-8 pt-28 pb-8 w-full max-w-[1400px] mx-auto min-h-screen flex flex-col justify-start">
            
            <!-- Alert -->
            <div class="w-full mb-6 animate-enter z-20">
                <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div class="flex items-start sm:items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 text-red-600"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
                            <span class="font-black text-red-800">ALERT:</span>
                            <span class="font-medium">Heavy rainfall expected in Zone 4. Please avoid low lying areas. • MUNICIPAL NOTICE: Water supply maintenance tomorrow.</span>
                        </div>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-red-400 border border-red-200 px-2 py-1 rounded bg-white whitespace-nowrap hidden md:block">Municipal Notice</span>
                </div>
            </div>

            <!-- MAIN SERVICES GRID -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-8 animate-enter">
                
                <!-- 1. ELECTRICITY -->
                <div (click)="openService('Electricity', 1240, 'text-yellow-900', 'bg-yellow-100')" class="kiosk-card card-yellow cursor-pointer min-h-[280px] p-8 flex flex-col justify-between text-white relative">
                    <div class="flex-1 flex flex-col justify-start items-start pb-6">
                        <div class="bg-white/20 p-4 rounded-xl mb-6 backdrop-blur-sm shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        </div>
                        <h3 class="text-3xl font-black leading-tight tracking-tight drop-shadow-sm">Electricity<br>Services</h3>
                    </div>
                    <div class="card-strip absolute bottom-0 left-0">
                        <span>View Bill & Pay</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                </div>

                <!-- 2. WATER -->
                <div (click)="openService('Water', 450, 'text-blue-900', 'bg-blue-100')" class="kiosk-card card-blue cursor-pointer min-h-[280px] p-8 flex flex-col justify-between text-white relative">
                    <div class="flex-1 flex flex-col justify-start items-start pb-6">
                        <div class="bg-white/20 p-4 rounded-xl mb-6 backdrop-blur-sm shadow-inner">
                             <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                        </div>
                        <h3 class="text-3xl font-black leading-tight tracking-tight drop-shadow-sm">Water &<br>Sanitation</h3>
                    </div>
                    <div class="card-strip absolute bottom-0 left-0">
                        <span>Connection Details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                </div>

                <!-- 3. GAS -->
                <div (click)="openService('Gas', 890, 'text-green-900', 'bg-green-100')" class="kiosk-card card-green cursor-pointer min-h-[280px] p-8 flex flex-col justify-between text-white relative">
                     <div class="flex-1 flex flex-col justify-start items-start pb-6">
                        <div class="bg-white/20 p-4 rounded-xl mb-6 backdrop-blur-sm shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.072-2.143-3-4-1.072 2.143-2.072 2.143-3 4-.5 1-1 1.62-1 3a2.5 2.5 0 0 0 2.5 2.5z"/><path d="M15.5 14.5A2.5 2.5 0 0 0 18 12c0-1.38-.5-2-1-3-1.072-2.143-2.072-2.143-3-4-1.072 2.143-2.072 2.143-3 4-.5 1-1 1.62-1 3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                        </div>
                        <h3 class="text-3xl font-black leading-tight tracking-tight drop-shadow-sm">Gas<br>Services</h3>
                    </div>
                    <div class="card-strip absolute bottom-0 left-0">
                        <span>Book Cylinder</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                </div>

                 <!-- 4. Pay Bills -->
                 <div (click)="navigateToPayment()" class="kiosk-card card-light cursor-pointer min-h-[280px] p-8 flex flex-col justify-between relative">
                     <div class="flex-1 flex flex-col justify-start items-start pb-6">
                        <div class="bg-orange-100 p-4 rounded-xl mb-6 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </div>
                        <h3 class="text-3xl font-black text-slate-800 mb-2 tracking-tight">Pay Bills</h3>
                        <p class="text-slate-500 font-bold text-sm">Clear all dues instantly</p>
                    </div>
                    <div class="action-strip bg-orange-50 border-t border-orange-100 text-orange-700 absolute bottom-0 left-0">
                        <span>Pay Last Bill</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                 </div>
            </div>

            <!-- Footer -->
            <div class="bg-white rounded-xl p-4 shadow-md border border-slate-200 flex items-center justify-between z-20 relative">
                <button (click)="logout()" class="bg-red-50 hover:bg-red-100 text-red-700 px-6 py-3 rounded-lg font-bold flex items-center gap-3 transition-colors border border-red-100 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span>Secure Logout</span>
                </button>

                <div class="flex-1 mx-8 text-center text-sm text-slate-600 font-medium truncate hidden sm:block">
                    <span class="text-red-600 font-bold bg-red-50 px-2 py-1 rounded mr-2">ALERT</span> Heavy rainfall expected in Zone 4. Please avoid low lying areas.
                </div>

                <div class="flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-50 px-4 py-3 rounded-lg border border-slate-100">
                    <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span class="hidden sm:inline">System Status: </span> READY
                </div>
            </div>
        </div>
    </div>
  `
})
export class DashboardComponent {
  authService = inject(AuthService);
  router = inject(Router);

  openService(name: string, due: number, color: string, colorBg: string) {
    this.router.navigate(['/service', name], { queryParams: { due, color, colorBg } });
  }

  navigateToPayment() {
    this.router.navigate(['/payment']);
  }

  logout() {
    this.authService.logout();
  }
}

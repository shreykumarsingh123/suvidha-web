import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="login" class="screen active justify-center items-center bg-slate-100 p-4 overflow-y-auto flex h-screen w-full">
        <div class="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:min-h-[600px] border border-slate-200 animate-enter relative my-auto">
            
            <!-- Left Panel -->
            <div class="hidden md:flex w-5/12 bg-[#0f172a] p-12 flex-col justify-between text-white relative">
                <div class="absolute inset-0 opacity-10"></div>
                <div class="relative z-10">
                    <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <h2 class="text-4xl font-bold mb-4 leading-tight">Secure Citizen<br>Authentication</h2>
                    <p class="text-slate-400 text-lg">Access electricity, water, gas, and municipal services securely.</p>
                </div>
            </div>

            <!-- Right Panel (Form) -->
            <div class="w-full md:w-7/12 p-8 md:p-12 flex flex-col items-center justify-center bg-white relative">
                <button (click)="goBack()" class="absolute top-6 left-6 p-4 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition-colors z-50 shadow-sm border border-slate-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                </button>

                <div class="w-full max-w-md">
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-slate-900 mb-2">Login</h2>
                        <p class="text-slate-500">Enter your 10-digit mobile number</p>
                    </div>

                    <!-- Input -->
                    <div class="bg-slate-50 p-3 rounded-2xl border-2 border-slate-200 focus-within:border-blue-600 transition-all shadow-inner mb-8 flex items-center">
                        <div class="px-5 py-2 border-r-2 border-slate-200">
                            <span class="text-slate-400 font-bold text-2xl">+91</span>
                        </div>
                        <input type="text" readonly [value]="mobileNumber()" class="w-full bg-transparent text-4xl font-mono p-4 text-slate-800 outline-none tracking-[0.2em] placeholder:text-slate-300 text-center cursor-text" placeholder="__________">
                    </div>

                    <!-- Keypad -->
                    <div class="grid grid-cols-3 gap-4 mb-8">
                        <button *ngFor="let num of [1,2,3,4,5,6,7,8,9]" (click)="addKey(num.toString())" class="btn-tactile h-20 bg-white text-slate-700 text-3xl font-bold rounded-xl border-b-[6px] border-slate-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-2 transition-all cursor-pointer">{{num}}</button>
                        
                        <button class="btn-tactile h-20 bg-amber-50 text-amber-700 font-bold rounded-xl border-b-[6px] border-amber-200 shadow-sm flex items-center justify-center text-lg active:border-b-0 active:translate-y-2 transition-all cursor-pointer" (click)="clearKey()">CLR</button>
                        <button (click)="addKey('0')" class="btn-tactile h-20 bg-white text-slate-700 text-3xl font-bold rounded-xl border-b-[6px] border-slate-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-2 transition-all cursor-pointer">0</button>
                        <button class="btn-tactile h-20 bg-red-50 text-red-600 font-bold rounded-xl border-b-[6px] border-red-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-2 transition-all cursor-pointer" (click)="delKey()">
                             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    </div>

                    <button (click)="proceed()" [disabled]="mobileNumber().length !== 10" [ngClass]="{'opacity-70 pointer-events-none': mobileNumber().length !== 10, 'bg-blue-600 border-blue-800 text-white': mobileNumber().length === 10, 'bg-slate-300 border-slate-400': mobileNumber().length !== 10}" class="w-full py-5 text-xl font-bold rounded-xl shadow-lg border-b-[6px] transition-all flex items-center justify-center gap-3 transform cursor-pointer">
                        <span>VERIFY & PROCEED</span> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                    <p class="text-center text-xs text-slate-400 mt-4">PC Users: Use keyboard numbers to type</p>
                </div>
            </div>
        </div>
    </div>
  `
})
export class LoginComponent {
    mobileNumber = signal('');
    authService = inject(AuthService);
    router = inject(Router);

    addKey(key: string) {
        if (this.mobileNumber().length < 10) {
            this.mobileNumber.update(v => v + key);
        }
    }

    delKey() {
        this.mobileNumber.update(v => v.slice(0, -1));
    }

    clearKey() {
        this.mobileNumber.set('');
    }

    goBack() {
        this.router.navigate(['/language']);
    }

    proceed() {
        if (this.mobileNumber().length === 10) {
            // Store temporarily for OTP verification
            sessionStorage.setItem('mobile', this.mobileNumber());
            this.authService.requestOtp(this.mobileNumber()).subscribe({
                next: () => {
                    this.router.navigate(['/otp'], { queryParams: { mobile: this.mobileNumber() } });
                },
                error: (err: any) => console.error(err)
            });
        }
    }
}


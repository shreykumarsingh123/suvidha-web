import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-otp',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="otp" class="screen active justify-center items-center bg-slate-100 p-4 overflow-y-auto flex h-screen w-full">
        <div class="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto md:min-h-[600px] border border-slate-200 animate-enter relative my-auto">
            
            <!-- Left Panel (Info) -->
            <div class="hidden md:flex w-5/12 bg-[#0f172a] p-12 flex-col justify-between text-white relative">
                 <div class="absolute inset-0 opacity-10"></div>
                <div class="relative z-10">
                    <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-8 border border-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h2 class="text-4xl font-bold mb-4 leading-tight">Identity<br>Verification</h2>
                    <p class="text-slate-400 text-lg">We have sent a 4-digit One Time Password (OTP) to your mobile.</p>
                </div>
            </div>

            <!-- Right Panel (Form) -->
            <div class="w-full md:w-7/12 p-8 md:p-12 flex flex-col items-center justify-center bg-white relative">
                <!-- Back Button -->
                <button (click)="goBack()" class="absolute top-6 left-6 p-4 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition-colors z-50 shadow-sm border border-slate-200 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                </button>

                <div class="w-full max-w-md">
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-slate-900 mb-2">Enter OTP</h2>
                        <p class="text-slate-500">Sent to {{mobileNumber}}</p>
                        <p *ngIf="lastOtpReceived()" class="text-green-600 font-bold mt-2 text-lg">Your OTP: {{lastOtpReceived()}}</p>
                    </div>

                    <!-- OTP Input -->
                    <div class="flex justify-center mb-8 gap-4">
                        <input type="text" readonly [value]="otp()" class="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl text-5xl font-mono py-4 text-center text-slate-800 tracking-[0.5em] focus:border-blue-500 outline-none cursor-text" placeholder="______">
                    </div>

                    <!-- Keypad -->
                    <div class="grid grid-cols-3 gap-4 mb-8">
                         <button *ngFor="let num of [1,2,3,4,5,6,7,8,9]" (click)="addKey(num.toString())" class="btn-tactile h-20 bg-white text-slate-700 text-3xl font-bold rounded-xl border-b-[6px] border-slate-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-2 transition-all cursor-pointer">{{num}}</button>
                        
                        <button class="btn-tactile h-20 bg-amber-50 text-amber-700 font-bold rounded-xl border-b-[6px] border-amber-200 shadow-sm flex items-center justify-center text-lg active:border-b-0 active:translate-y-2 transition-all cursor-pointer" (click)="clearKey()">CLR</button>
                        <button (click)="addKey('0')" class="btn-tactile h-20 bg-white text-slate-700 text-3xl font-bold rounded-xl border-b-[6px] border-slate-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-2 transition-all cursor-pointer">0</button>
                        <button class="btn-tactile h-20 bg-red-50 text-red-600 font-bold rounded-xl border-b-[6px] border-red-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-2 transition-all cursor-pointer" (click)="delKey()">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <button (click)="verify()" [disabled]="otp().length !== 6" [ngClass]="{'opacity-70 pointer-events-none': otp().length !== 6, 'bg-blue-600 border-blue-800 text-white': otp().length === 6, 'bg-slate-300 border-slate-400': otp().length !== 6}" class="w-full py-5 text-xl font-bold rounded-xl shadow-lg border-b-[6px] transition-all flex items-center justify-center gap-3 transform cursor-pointer">
                            <span>CONFIRM OTP</span> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </button>
                        <button 
                            [disabled]="!canResend()" 
                            [ngClass]="{'opacity-50 cursor-not-allowed': !canResend(), 'hover:text-blue-600': canResend()}" 
                            class="w-full text-slate-500 font-bold text-sm transition-colors cursor-pointer" 
                            (click)="resendOtp()">
                            {{ canResend() ? 'Resend OTP' : 'Resend OTP (' + resendTimer() + 's)' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class OtpComponent implements OnInit {
    otp = signal('');
    mobileNumber = '';
    authService = inject(AuthService);
    router = inject(Router);
    route = inject(ActivatedRoute);
    resendTimer = signal(30);
    canResend = signal(false);
    lastOtpReceived = signal('');

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.mobileNumber = params['mobile'] || sessionStorage.getItem('mobile') || '';
            if (!this.mobileNumber) {
                this.router.navigate(['/login']);
            } else {
                this.startResendTimer();
            }
        });
    }

    private startResendTimer() {
        this.canResend.set(false);
        this.resendTimer.set(30);
        const interval = setInterval(() => {
            const current = this.resendTimer();
            if (current <= 1) {
                clearInterval(interval);
                this.canResend.set(true);
            } else {
                this.resendTimer.set(current - 1);
            }
        }, 1000);
    }

    addKey(key: string) {
        if (this.otp().length < 6) {
            this.otp.update(v => v + key);
        }
    }

    delKey() {
        this.otp.update(v => v.slice(0, -1));
    }

    clearKey() {
        this.otp.set('');
    }

    goBack() {
        this.router.navigate(['/login']);
    }

    verify() {
        if (this.otp().length === 6) {
            this.authService.verifyOtp(this.mobileNumber, this.otp()).subscribe({
                next: () => {
                    sessionStorage.removeItem('mobile');
                    this.router.navigate(['/dashboard']);
                },
                error: (err: any) => {
                    console.error(err);
                    alert('Invalid OTP. Please try again.');
                    this.clearKey();
                }
            });
        }
    }

    resendOtp() {
        if (!this.canResend()) return;

        this.authService.requestOtp(this.mobileNumber).subscribe({
            next: (response: any) => {
                if (response.success) {
                    // In development mode, the OTP is returned in the response
                    if (response.otp) {
                        this.lastOtpReceived.set(response.otp);
                        alert(`OTP Resent!\n\nYour OTP: ${response.otp}\n\n(OTP is shown because you're in development mode)`);
                        console.log('🔐 Development OTP:', response.otp);
                    } else {
                        alert('OTP has been resent to your mobile number.');
                    }
                    this.startResendTimer();
                } else {
                    alert('Failed to resend OTP. Please try again.');
                }
            },
            error: (err) => {
                console.error('Resend OTP error:', err);
                alert('Failed to resend OTP. Please try again.');
            }
        });
    }
}


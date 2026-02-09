import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-payment',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="payment" class="screen active justify-center items-center bg-slate-100 p-6 overflow-y-auto flex h-screen w-full">
        <div class="w-full h-full flex items-center justify-center pt-28 pb-10">
            <div class="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-enter">
                <div class="w-full md:w-1/2 p-10 border-r border-slate-100 bg-slate-50 flex flex-col">
                    <h2 class="text-2xl font-bold text-slate-800 mb-8">Select Method</h2>
                    <div class="space-y-4">
                        <div class="p-6 bg-white border-2 border-blue-500 rounded-2xl shadow-md flex items-center gap-4 cursor-pointer transform scale-[1.02] hover:bg-blue-50 transition-colors">
                            <div class="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-bold text-lg text-slate-800">UPI / QR</h3>
                                <p class="text-xs text-slate-500">GPay, PhonePe, Paytm</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-blue-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                    </div>
                    <button (click)="goBack()" class="mt-auto flex items-center gap-2 text-slate-500 font-bold p-2 hover:text-slate-800 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                        Cancel
                    </button>
                </div>
                <div class="w-full md:w-1/2 p-10 flex flex-col items-center justify-center bg-white">
                    <h2 class="text-2xl font-bold text-slate-800 mb-6">Scan QR</h2>
                    <div class="bg-white p-4 rounded-3xl shadow-lg border-2 border-slate-100 mb-8 relative group">
                        <div class="w-56 h-56 bg-slate-900 flex items-center justify-center rounded-2xl relative overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-40 h-40 text-white opacity-80"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="3" height="3"/><rect x="14" y="7" width="3" height="3"/><rect x="7" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/></svg>
                            <div class="absolute top-0 left-0 w-full h-2 bg-blue-500 shadow-[0_0_20px_#3b82f6] animate-[marquee_1.5s_linear_infinite]"></div>
                        </div>
                    </div>
                    <button (click)="processPayment()" class="px-10 py-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full font-bold hover:bg-emerald-100 transition-colors animate-pulse cursor-pointer">
                        Simulate Payment Success
                    </button>
                </div>
            </div>
        </div>
    </div>
  `
})
export class PaymentComponent {
    router = inject(Router);

    processPayment() {
        this.router.navigate(['/receipt']);
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}


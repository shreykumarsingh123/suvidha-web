import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><rect width="5" height="5" x="7" y="7"/><rect width="5" height="5" x="7" y="17"/><rect width="5" height="5" x="17" y="7"/><rect width="5" height="5" x="17" y="17"/></svg>
                             </div>
                             <div class="flex-1">
                                 <h3 class="font-bold text-lg text-slate-800">UPI / QR</h3>
                                 <p class="text-xs text-slate-500">GPay, PhonePe, Paytm</p>
                             </div>
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-blue-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                         </div>
                     </div>
                     <button (click)="cancel()" class="mt-auto flex items-center gap-2 text-slate-500 font-bold p-2 hover:text-slate-800 cursor-pointer">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> <span>Cancel</span>
                     </button>
                </div>
                <div class="w-full md:w-1/2 p-10 flex flex-col items-center justify-center bg-white">
                    <h2 class="text-2xl font-bold text-slate-800 mb-6">Scan QR</h2>
                    <div class="bg-white p-4 rounded-3xl shadow-lg border-2 border-slate-100 mb-8 relative group">
                        <div class="w-56 h-56 bg-slate-900 flex items-center justify-center rounded-2xl relative overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-white opacity-80"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><rect width="5" height="5" x="7" y="7"/><rect width="5" height="5" x="7" y="17"/><rect width="5" height="5" x="17" y="7"/><rect width="5" height="5" x="17" y="17"/></svg>
                            <div class="absolute top-0 left-0 w-full h-2 bg-blue-500 shadow-[0_0_20px_#3b82f6] animate-[marquee_1.5s_linear_infinite]"></div>
                        </div>
                    </div>
                    <button (click)="simulateSuccess()" class="px-10 py-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full font-bold hover:bg-emerald-100 transition-colors animate-pulse cursor-pointer">
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

    cancel() {
        this.router.navigate(['/dashboard']);
    }

    simulateSuccess() {
        this.router.navigate(['/receipt']);
    }
}

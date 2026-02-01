import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-consumer-input',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="consumer-input" class="screen active justify-center items-center bg-slate-100 p-6 overflow-y-auto flex h-screen w-full">
        <div class="w-full h-full flex items-center justify-center pt-28 pb-10">
            <div class="max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row h-[600px] animate-enter">
                
                <!-- Left: Info -->
                <div class="w-full md:w-5/12 bg-slate-50 p-10 flex flex-col justify-between border-r border-slate-100">
                    <div>
                        <button (click)="goBack()" class="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-slate-800 transition-colors cursor-pointer">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                             <span>Back</span>
                        </button>
                        <h2 class="text-3xl font-black text-slate-800 mb-2">Consumer No.</h2>
                        <p class="text-slate-500 text-lg">Enter your connection ID for <br><span class="font-bold text-blue-600">{{providerName}}</span></p>
                    </div>
                     <div class="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sample Bill</div>
                        <div class="h-2 w-2/3 bg-slate-200 rounded mb-2"></div>
                        <div class="h-2 w-1/2 bg-slate-200 rounded mb-4"></div>
                        <div class="h-8 w-full border-2 border-red-400 bg-red-50 rounded flex items-center justify-center text-red-500 font-bold text-xs">
                            Consumer No: 123456789
                        </div>
                    </div>
                </div>

                <!-- Right: Keypad -->
                 <div class="w-full md:w-7/12 p-10 flex flex-col">
                    <div class="bg-slate-100 p-4 rounded-2xl border-2 border-slate-200 mb-8 flex items-center">
                        <input type="text" readonly [value]="consumerNumber()" class="w-full bg-transparent text-4xl font-mono p-4 text-slate-800 outline-none tracking-[0.2em] placeholder:text-slate-300 text-center" placeholder="____________">
                    </div>

                    <div class="grid grid-cols-3 gap-4 mb-auto">
                        @for (num of [1,2,3,4,5,6,7,8,9]; track num) {
                            <button (click)="addKey(num.toString())" class="btn-tactile h-20 bg-white text-slate-700 text-3xl font-bold rounded-xl border-b-[6px] border-slate-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-2 transition-all cursor-pointer">{{num}}</button>
                        }
                        <button (click)="clearKey()" class="btn-tactile h-20 bg-amber-50 text-amber-700 font-bold rounded-xl border-b-[6px] border-amber-200 shadow-sm flex items-center justify-center text-lg active:border-b-0 active:translate-y-2 transition-all cursor-pointer">CLR</button>
                        <button (click)="addKey('0')" class="btn-tactile h-20 bg-white text-slate-700 text-3xl font-bold rounded-xl border-b-[6px] border-slate-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-2 transition-all cursor-pointer">0</button>
                        <button (click)="delKey()" class="btn-tactile h-20 bg-red-50 text-red-600 font-bold rounded-xl border-b-[6px] border-red-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-2 transition-all cursor-pointer">
                             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    </div>

                    <button (click)="fetchBill()" [disabled]="consumerNumber().length < 4" class="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-xl shadow-lg border-b-[6px] border-blue-800 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <span>FETCH BILL DETAILS</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                 </div>
            </div>
        </div>
    </div>
  `
})
export class ConsumerInputComponent {
    consumerNumber = signal('');
    providerName = '';
    serviceType = '';

    router = inject(Router);
    route = inject(ActivatedRoute);

    constructor() {
        this.route.queryParams.subscribe(params => {
            this.providerName = params['provider'] || 'Provider';
            this.serviceType = params['serviceType'] || 'elec';
        });
    }

    addKey(key: string) {
        if (this.consumerNumber().length < 12) {
            this.consumerNumber.update(v => v + key);
        }
    }

    delKey() {
        this.consumerNumber.update(v => v.slice(0, -1));
    }

    clearKey() {
        this.consumerNumber.set('');
    }

    goBack() {
        this.router.navigate(['/provider-select'], { queryParams: { type: this.serviceType } });
    }

    fetchBill() {
        // Simulate Logic
        this.router.navigate(['/service', this.serviceType], {
            queryParams: {
                due: 1240,
                provider: this.providerName
            }
        });
    }
}

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-consumer-input',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="consumer-input" class="screen active justify-center items-center bg-slate-100 p-6 overflow-y-auto flex h-screen w-full">
        <div class="w-full h-full flex items-center justify-center pt-28 pb-10">
            <div class="max-w-lg w-full bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-enter">
                <div class="p-8 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
                    <button (click)="goBack()" class="p-2 hover:bg-white rounded-full transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-slate-600"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    </button>
                    <div>
                        <h2 class="text-xl font-bold text-slate-900">{{providerName}}</h2>
                        <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Enter Details</p>
                    </div>
                </div>
                
                <div class="p-8">
                    <label class="block text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">Consumer / Connection ID</label>
                    <div class="flex justify-center mb-8">
                        <input type="text" readonly [value]="consumerNumber()" class="w-full bg-slate-50 border-2 border-slate-200 rounded-xl text-3xl font-mono py-4 px-4 text-center text-slate-800 tracking-widest focus:border-blue-500 outline-none" placeholder="XXXXXXXX">
                    </div>

                    <!-- Mini Keypad -->
                    <div class="grid grid-cols-3 gap-3 mb-8">
                        <button *ngFor="let num of [1,2,3,4,5,6,7,8,9]" (click)="addKey(num.toString())" class="btn-tactile h-16 bg-white text-slate-700 text-2xl font-bold rounded-lg border-b-[4px] border-slate-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-1 transition-all cursor-pointer">{{num}}</button>
                        <button class="btn-tactile h-16 bg-amber-50 text-amber-700 font-bold rounded-lg border-b-[4px] border-amber-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-1 transition-all cursor-pointer" (click)="clearKey()">C</button>
                        <button (click)="addKey('0')" class="btn-tactile h-16 bg-white text-slate-700 text-2xl font-bold rounded-lg border-b-[4px] border-slate-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-1 transition-all cursor-pointer">0</button>
                        <button class="btn-tactile h-16 bg-red-50 text-red-600 font-bold rounded-lg border-b-[4px] border-red-200 shadow-sm flex items-center justify-center active:border-b-0 active:translate-y-1 transition-all cursor-pointer" (click)="delKey()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    </div>
                    
                    <button (click)="fetchBill()" class="w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-xl shadow-lg border-b-[4px] border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 cursor-pointer">
                        Fetch Bill <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  `
})
export class ConsumerInputComponent implements OnInit {
    consumerNumber = signal('');
    serviceType = '';
    providerName = '';
    
    router = inject(Router);
    route = inject(ActivatedRoute);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.serviceType = params['type'] || 'elec';
            this.providerName = params['provider'] || 'Provider';
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

    fetchBill() {
        if (this.consumerNumber().length > 0) {
            // Demo bill amounts
            const bills: any = { 'elec': 1240, 'water': 450, 'gas': 890, 'muni': 0 };
            const amount = bills[this.serviceType] || 500;
            
            this.router.navigate(['/service', this.serviceType], { 
                queryParams: { 
                    provider: this.providerName,
                    consumer: this.consumerNumber(),
                    amount: amount
                } 
            });
        }
    }

    goBack() {
        this.router.navigate(['/provider-select'], { queryParams: { type: this.serviceType } });
    }
}


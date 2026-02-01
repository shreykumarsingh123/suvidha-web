import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-service-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="service" class="screen active justify-center items-center bg-slate-100 p-6 overflow-y-auto flex h-screen w-full">
         <div class="w-full h-full flex items-center justify-center pt-28 pb-10">
             <div class="max-w-lg w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-enter">
                <div class="p-8 border-b flex items-center gap-6 bg-slate-50">
                    <div class="bg-white p-4 rounded-2xl shadow-sm">
                        <!-- Dynamic Icon would be better but simple zap for now -->
                         <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    </div>
                    <div>
                        <h2 class="text-3xl font-black text-slate-800">{{serviceName}}</h2>
                        <p class="text-sm text-slate-600 font-medium uppercase tracking-wide">Government Utility</p>
                    </div>
                </div>
                <div class="p-8">
                    <div class="flex justify-between items-end mb-8">
                        <div>
                            <p class="text-slate-500 font-medium mb-1 uppercase text-xs tracking-wider">Total Outstanding</p>
                            <span class="text-5xl font-black text-slate-800 tracking-tight">₹{{due}}</span>
                        </div>
                        <span class="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-bold mb-2">Due in 2 Days</span>
                    </div>
                    
                    <div class="bg-slate-50 rounded-xl p-6 space-y-4 mb-8 border border-slate-100">
                        <div class="flex justify-between text-sm text-slate-500">
                            <span>Bill Date</span>
                            <span class="font-mono text-slate-700 font-bold">12 Jan 2026</span>
                        </div>
                        <div class="flex justify-between text-sm text-slate-500">
                            <span>Bill Number</span>
                            <span class="font-mono text-slate-700 font-bold">#9928-112</span>
                        </div>
                         <div class="flex justify-between text-sm text-slate-500">
                            <span>Consumer Name</span>
                            <span class="font-mono text-slate-700 font-bold">Arjun Sharma</span>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4">
                        <button (click)="pay()" class="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-xl shadow-lg border-b-[6px] border-blue-800 active:border-b-0 active:translate-y-1.5 transition-all flex items-center justify-center gap-3 cursor-pointer">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                             <span>Pay Securely</span>
                        </button>
                        <button (click)="cancel()" class="w-full py-4 bg-white text-slate-600 font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
                            <span>Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class ServiceDetailComponent implements OnInit {
    serviceName = '';
    due = 0;
    router = inject(Router);
    route = inject(ActivatedRoute);

    ngOnInit() {
        this.serviceName = this.route.snapshot.paramMap.get('id') || 'Service';
        this.route.queryParams.subscribe(p => {
            this.due = p['due'];
        });
    }

    pay() {
        this.router.navigate(['/payment']);
    }

    cancel() {
        this.router.navigate(['/dashboard']);
    }
}

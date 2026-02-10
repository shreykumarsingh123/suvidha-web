import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { IdleService } from '../../../core/services/idle.service';
import { AuthService } from '../../../core/services/auth.service';

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
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 text-slate-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
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
                            <span class="text-5xl font-black text-slate-800 tracking-tight">₹{{amount}}</span>
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
                            <span class="font-mono text-slate-700 font-bold">{{provider}}</span>
                        </div>
                    </div>

                    <div *ngIf="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        {{error}}
                    </div>

                    <div class="flex flex-col gap-4">
                        <button (click)="payNow()" [disabled]="processing" class="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-xl shadow-lg border-b-[6px] border-blue-800 active:border-b-0 active:translate-y-1.5 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                            {{processing ? 'Processing...' : 'Pay Securely'}}
                        </button>
                        <button (click)="goBack()" class="w-full py-4 bg-white text-slate-600 font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-all cursor-pointer">
                            Cancel
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
    provider = '';
    amount = 0;
    processing = false;
    error: string | null = null;

    router = inject(Router);
    route = inject(ActivatedRoute);
    paymentService = inject(PaymentService);
    idleService = inject(IdleService);
    authService = inject(AuthService);

    ngOnInit() {
        this.route.params.subscribe(params => {
            const type = params['id'] || 'elec';
            const names: any = { 'elec': 'Electricity Services', 'water': 'Water & Sanitation', 'gas': 'Gas Services', 'muni': 'Municipal' };
            this.serviceName = names[type] || 'Service';
        });

        this.route.queryParams.subscribe(params => {
            this.provider = params['provider'] || 'Consumer';
            this.amount = params['amount'] || 0;
        });
    }

    async payNow() {
        this.processing = true;
        this.error = null;

        try {
            // Get current user
            const currentUser = this.authService.currentUser();
            if (!currentUser) {
                this.error = 'Please log in to continue';
                this.processing = false;
                return;
            }

            // Create payment order
            const result = await this.paymentService.createPaymentOrder({
                amount: this.amount,
                customerName: this.provider,
                customerPhone: currentUser.mobileNumber || '0000000000'
            }).toPromise();

            if (result?.success && result.data) {
                // Initiate Cashfree payment
                this.paymentService.initiateCashfreePayment(
                    result.data.paymentSessionId,
                    result.data.orderId
                );
            } else {
                this.error = 'Failed to create payment order. Please try again.';
                this.processing = false;
            }
        } catch (err: any) {
            this.error = err.message || 'Payment initialization failed';
            this.processing = false;
        }
    }

    goBack() {
        this.router.navigate(['/consumer-input']);
    }
}


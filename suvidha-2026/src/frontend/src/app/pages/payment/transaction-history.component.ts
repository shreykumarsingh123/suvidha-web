import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

interface Payment {
    id: number;
    order_id: string;
    amount: number;
    status: string;
    payment_method?: string;
    transaction_id?: string;
    payment_time?: string;
    created_at: string;
    service_type?: string;
    consumer_number?: string;
}

@Component({
    selector: 'app-transaction-history',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <!-- Header -->
        <div class="max-w-6xl mx-auto mb-8 pt-20">
            <div class="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button (click)="goBack()" 
                        class="bg-slate-100 hover:bg-slate-200 p-3 rounded-xl transition-colors">
                        <i data-lucide="arrow-left" class="w-6 h-6 text-slate-700"></i>
                    </button>
                    <div>
                        <h1 class="text-3xl font-black text-slate-800">Transaction History</h1>
                        <p class="text-slate-500 font-semibold">View all your payment records</p>
                    </div>
                </div>
                <button (click)="logout()" 
                    class="bg-red-50 hover:bg-red-100 text-red-700 px-6 py-3 rounded-lg font-bold flex items-center gap-3 transition-colors border border-red-100">
                    <i data-lucide="log-out" class="w-5 h-5"></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>

        <!-- Transactions List -->
        <div class="max-w-6xl mx-auto">
            <!-- Loading State -->
            <div *ngIf="loading" class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-slate-600 font-semibold">Loading transactions...</p>
            </div>

            <!-- Empty State -->
            <div *ngIf="!loading && payments.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div class="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i data-lucide="inbox" class="w-12 h-12 text-slate-400"></i>
                </div>
                <h3 class="text-2xl font-bold text-slate-800 mb-2">No Transactions Yet</h3>
                <p class="text-slate-500 mb-6">You haven't made any payments yet</p>
                <button (click)="goBack()" 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors">
                    Go to Dashboard
                </button>
            </div>

            <!-- Transactions Grid -->
            <div *ngIf="!loading && payments.length > 0" class="space-y-4">
                <div *ngFor="let payment of payments" 
                    class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4"
                    [ngClass]="{
                        'border-green-500': payment.status === 'success',
                        'border-red-500': payment.status === 'failed',
                        'border-yellow-500': payment.status === 'pending'
                    }">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-3">
                                <!-- Status Badge -->
                                <span class="px-4 py-1.5 rounded-full text-sm font-bold"
                                    [ngClass]="{
                                        'bg-green-100 text-green-700': payment.status === 'success',
                                        'bg-red-100 text-red-700': payment.status === 'failed',
                                        'bg-yellow-100 text-yellow-700': payment.status === 'pending'
                                    }">
                                    {{ payment.status | uppercase }}
                                </span>
                                <span *ngIf="payment.service_type" 
                                    class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                    {{ payment.service_type | uppercase }}
                                </span>
                            </div>

                            <h3 class="text-xl font-bold text-slate-800 mb-2">
                                Order #{{ payment.order_id }}
                            </h3>

                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p class="text-slate-500 font-semibold">Amount</p>
                                    <p class="text-slate-800 font-bold text-lg">₹{{ payment.amount }}</p>
                                </div>
                                <div *ngIf="payment.payment_method">
                                    <p class="text-slate-500 font-semibold">Payment Method</p>
                                    <p class="text-slate-800 font-bold">{{ payment.payment_method }}</p>
                                </div>
                                <div *ngIf="payment.transaction_id">
                                    <p class="text-slate-500 font-semibold">Transaction ID</p>
                                    <p class="text-slate-800 font-mono text-xs">{{ payment.transaction_id }}</p>
                                </div>
                                <div *ngIf="payment.consumer_number">
                                    <p class="text-slate-500 font-semibold">Consumer Number</p>
                                    <p class="text-slate-800 font-bold">{{ payment.consumer_number }}</p>
                                </div>
                                <div>
                                    <p class="text-slate-500 font-semibold">Date</p>
                                    <p class="text-slate-800 font-bold">{{ formatDate(payment.payment_time || payment.created_at) }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Download Receipt Button (only for successful payments) -->
                        <div *ngIf="payment.status === 'success'" class="ml-4">
                            <button (click)="downloadReceipt(payment.order_id)" 
                                class="bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-xl transition-colors">
                                <i data-lucide="download" class="w-6 h-6"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
})
export class TransactionHistoryComponent implements OnInit {
    router = inject(Router);
    http = inject(HttpClient);
    authService = inject(AuthService);

    payments: Payment[] = [];
    loading = true;

    ngOnInit() {
        this.loadTransactions();
        // Initialize Lucide icons after view init
        setTimeout(() => {
            if (typeof (window as any).lucide !== 'undefined') {
                (window as any).lucide.createIcons();
            }
        }, 100);
    }

    loadTransactions() {
        this.loading = true;
        this.http.get<any>(`${environment.apiUrl}/payment/history`)
            .subscribe({
                next: (response) => {
                    this.payments = response.data || [];
                    this.loading = false;
                    // Re-initialize icons after data loads
                    setTimeout(() => {
                        if (typeof (window as any).lucide !== 'undefined') {
                            (window as any).lucide.createIcons();
                        }
                    }, 100);
                },
                error: (error) => {
                    console.error('Error loading transactions:', error);
                    this.loading = false;
                    // Re-initialize icons even on error
                    setTimeout(() => {
                        if (typeof (window as any).lucide !== 'undefined') {
                            (window as any).lucide.createIcons();
                        }
                    }, 100);
                }
            });
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    downloadReceipt(orderId: string) {
        window.open(`${environment.apiUrl}/payment/receipt/${orderId}`, '_blank');
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    logout() {
        this.authService.logout();
    }
}

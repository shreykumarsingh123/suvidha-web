import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';

@Component({
    selector: 'app-payment-callback',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 bg-slate-100 flex items-center justify-center">
        <div class="max-w-md w-full mx-4">
            <div *ngIf="loading" class="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Verifying Payment...</h2>
                <p class="text-slate-600">Please wait while we confirm your transaction</p>
            </div>

            <div *ngIf="!loading && success" class="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                <p class="text-slate-600 mb-4">Redirecting to receipt...</p>
            </div>

            <div *ngIf="!loading && !success" class="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                <p class="text-slate-600 mb-4">{{error}}</p>
                <button (click)="returnToDashboard()" class="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                    Return to Dashboard
                </button>
            </div>
        </div>
    </div>
  `,
    styles: []
})
export class PaymentCallbackComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private paymentService = inject(PaymentService);

    loading = true;
    success = false;
    error = '';

    ngOnInit() {
        const orderId = this.route.snapshot.queryParams['order_id'];

        if (!orderId) {
            this.error = 'Invalid payment reference';
            this.loading = false;
            return;
        }

        // Verify payment
        this.paymentService.verifyPayment(orderId).subscribe({
            next: (result) => {
                this.loading = false;
                if (result.success && result.data.status === 'success') {
                    this.success = true;
                    // Redirect to receipt after 1 second
                    setTimeout(() => {
                        this.router.navigate(['/receipt'], {
                            queryParams: { orderId }
                        });
                    }, 1000);
                } else {
                    this.error = 'Payment verification failed';
                }
            },
            error: (err) => {
                this.loading = false;
                this.error = err.message || 'Failed to verify payment';
            }
        });
    }

    returnToDashboard() {
        this.router.navigate(['/dashboard']);
    }
}

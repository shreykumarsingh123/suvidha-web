import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';

@Component({
    selector: 'app-payment-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Payment</h2>
            <button 
              (click)="close()"
              class="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div *ngIf="!processing && !paymentSuccess" class="space-y-4">
            <!-- Amount Display -->
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-200">
              <p class="text-sm text-gray-600 mb-1">Amount to Pay</p>
              <p class="text-4xl font-bold text-green-600">₹{{ amount }}</p>
            </div>

            <!-- Bill Details -->
            <div *ngIf="billDetails" class="bg-gray-50 rounded-lg p-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Service Type:</span>
                <span class="font-medium">{{ billDetails.serviceType }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Consumer Number:</span>
                <span class="font-medium">{{ billDetails.consumerNumber }}</span>
              </div>
              <div *ngIf="billDetails.billMonth" class="flex justify-between text-sm">
                <span class="text-gray-600">Bill Month:</span>
                <span class="font-medium">{{ billDetails.billMonth }}</span>
              </div>
            </div>

            <!-- Pay Button -->
            <button
              (click)="initiatePayment()"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] shadow-lg">
              Proceed to Payment
            </button>
          </div>

          <!-- Processing State -->
          <div *ngIf="processing" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <p class="text-gray-600">Processing payment...</p>
          </div>

          <!-- Success State -->
          <div *ngIf="paymentSuccess" class="text-center py-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p class="text-gray-600 mb-6">Your payment has been processed successfully.</p>
            <button
              (click)="close()"
              class="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class PaymentModalComponent {
    @Input() isOpen = false;
    @Input() amount = 0;
    @Input() billId?: number;
    @Input() billDetails?: {
        serviceType: string;
        consumerNumber: string;
        billMonth?: string;
    };
    @Input() customerName = '';
    @Input() customerPhone = '';

    @Output() closed = new EventEmitter<void>();
    @Output() paymentCompleted = new EventEmitter<void>();

    private paymentService = inject(PaymentService);

    processing = false;
    paymentSuccess = false;

    close() {
        this.isOpen = false;
        this.closed.emit();
    }

    initiatePayment() {
        this.processing = true;

        this.paymentService.createPaymentOrder({
            amount: this.amount,
            billId: this.billId,
            customerName: this.customerName,
            customerPhone: this.customerPhone
        }).subscribe({
            next: (response) => {
                if (response.success) {
                    // Initiate Cashfree payment
                    this.paymentService.initiateCashfreePayment(
                        response.data.paymentSessionId,
                        response.data.orderId
                    );

                    // Simulate success for demo (remove in production)
                    setTimeout(() => {
                        this.processing = false;
                        this.paymentSuccess = true;
                        this.paymentCompleted.emit();
                    }, 2000);
                } else {
                    this.processing = false;
                    alert('Failed to create payment order');
                }
            },
            error: (error) => {
                this.processing = false;
                console.error('Payment error:', error);
                alert('Payment failed. Please try again.');
            }
        });
    }
}

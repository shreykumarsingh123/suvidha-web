import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentOrder {
    orderId: string;
    paymentSessionId: string;
    orderStatus: string;
}

export interface Payment {
    id: number;
    order_id: string;
    amount: number;
    status: string;
    payment_method?: string;
    transaction_id?: string;
    payment_time?: Date;
    created_at: Date;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/payments`;

    /**
     * Create payment order
     */
    createPaymentOrder(data: {
        amount: number;
        billId?: number;
        customerName: string;
        customerPhone: string;
    }): Observable<{ success: boolean; data: PaymentOrder }> {
        return this.http.post<{ success: boolean; data: PaymentOrder }>(
            `${this.apiUrl}/create-order`,
            data
        );
    }

    /**
     * Verify payment status
     */
    verifyPayment(orderId: string): Observable<{ success: boolean; data: Payment }> {
        return this.http.get<{ success: boolean; data: Payment }>(
            `${this.apiUrl}/verify/${orderId}`
        );
    }

    /**
     * Get payment history
     */
    getPaymentHistory(): Observable<{ success: boolean; data: Payment[] }> {
        return this.http.get<{ success: boolean; data: Payment[] }>(
            `${this.apiUrl}/history`
        );
    }

    /**
     * Download receipt
     */
    downloadReceipt(orderId: string): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/receipt/${orderId}`, {
            responseType: 'blob'
        });
    }

    /**
     * Initialize Cashfree payment
     */
    initiateCashfreePayment(paymentSessionId: string, orderId: string): void {
        // Load Cashfree SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.onload = () => {
            this.openCashfreeCheckout(paymentSessionId, orderId);
        };
        document.head.appendChild(script);
    }

    private openCashfreeCheckout(paymentSessionId: string, orderId: string): void {
        const cashfree = (window as any).Cashfree({
            mode: environment.production ? 'production' : 'sandbox'
        });

        const checkoutOptions = {
            paymentSessionId: paymentSessionId,
            returnUrl: `${window.location.origin}/payment/callback?order_id=${orderId}`,
        };

        cashfree.checkout(checkoutOptions).then((result: any) => {
            if (result.error) {
                console.error('Payment failed:', result.error);
            }
            if (result.paymentDetails) {
                console.log('Payment successful:', result.paymentDetails);
            }
        });
    }
}

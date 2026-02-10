import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../core/services/payment.service';
import { IdleService } from '../../core/services/idle.service';

@Component({
    selector: 'app-receipt',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="receipt" class="screen active justify-center items-center bg-slate-900 overflow-y-auto flex h-screen w-full">
        <div class="relative w-full max-w-[340px] flex flex-col items-center my-auto py-10">
            <!-- Printer Slot -->
            <div class="w-[360px] h-14 bg-gradient-to-b from-slate-800 to-slate-900 rounded-full mb-[-20px] z-20 shadow-2xl relative border-b border-slate-700 flex items-center justify-center">
                <div class="w-40 h-2 bg-black/50 rounded-full"></div>
            </div>
            
            <!-- Paper -->
            <div class="bg-white w-[320px] p-8 text-center shadow-2xl relative z-10 paper-print overflow-hidden flex flex-col rounded-b-xl">
                <div class="border-b-2 border-dashed border-gray-300 pb-6 mb-6">
                    <div class="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl shadow-lg">🏛</div>
                    <h3 class="font-black text-2xl tracking-wider text-slate-900">SUVIDHA</h3>
                    <p class="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Official Receipt</p>
                </div>
                
                <div class="text-left text-sm font-mono space-y-3 flex-1 text-slate-600">
                    <div class="flex justify-between"><span>Date:</span><span class="text-slate-900 font-bold">{{today}}</span></div>
                    <div class="flex justify-between"><span>Time:</span><span class="text-slate-900 font-bold">{{currentTime}}</span></div>
                    <div class="flex justify-between"><span>Order ID:</span><span class="text-slate-900 font-bold text-xs">{{orderId || 'N/A'}}</span></div>
                    <div class="flex justify-between"><span>Txn ID:</span><span class="text-slate-900 font-bold text-xs">{{txnId}}</span></div>
                    <div class="border-b border-slate-100 my-2"></div>
                    <div class="flex justify-between font-bold text-xl text-slate-900"><span>PAID:</span><span>₹{{amount}}</span></div>
                </div>
                
                <div class="mt-8 pt-4 border-t-2 border-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 mx-auto text-green-600 mb-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <p class="text-xs font-bold text-green-700 uppercase">Payment Successful</p>
                </div>
                
                <!-- Jagged Edge -->
                <div class="absolute bottom-0 left-0 w-full h-3 bg-slate-900" style="clip-path: polygon(0% 100%, 2% 0%, 4% 100%, 6% 0%, 8% 100%, 10% 0%, 12% 100%, 14% 0%, 16% 100%, 18% 0%, 20% 100%, 22% 0%, 24% 100%, 26% 0%, 28% 100%, 30% 0%, 32% 100%, 34% 0%, 36% 100%, 38% 0%, 40% 100%, 42% 0%, 44% 100%, 46% 0%, 48% 100%, 50% 0%, 52% 100%, 54% 0%, 56% 100%, 58% 0%, 60% 100%, 62% 0%, 64% 100%, 66% 0%, 68% 100%, 70% 0%, 72% 100%, 74% 0%, 76% 100%, 78% 0%, 80% 100%, 82% 0%, 84% 100%, 86% 0%, 88% 100%, 90% 0%, 92% 100%, 94% 0%, 96% 100%, 98% 0%, 100% 100%);"></div>
            </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button (click)="downloadReceipt()" [disabled]="downloading" class="px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" *ngIf="!downloading"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                <span>{{downloading ? 'Downloading...' : 'Download Receipt'}}</span>
            </button>
            
            <button (click)="printReceipt()" class="px-8 py-4 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg cursor-pointer flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Print Receipt
            </button>
            
            <button (click)="finish()" class="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-colors shadow-lg cursor-pointer">
                Return to Dashboard
            </button>
        </div>
    </div>
  `
})
export class ReceiptComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private paymentService = inject(PaymentService);
    private idleService = inject(IdleService);

    today = new Date().toLocaleDateString('en-GB');
    currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    txnId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    orderId = '';
    amount = 1240;
    downloading = false;

    ngOnInit() {
        // Get order ID from query params
        this.orderId = this.route.snapshot.queryParams['orderId'] || '';

        // Auto-download receipt after 2 seconds
        setTimeout(() => {
            if (this.orderId) {
                this.downloadReceipt();
            }
        }, 2000);
    }

    downloadReceipt() {
        if (!this.orderId || this.downloading) return;

        this.downloading = true;
        this.paymentService.downloadReceipt(this.orderId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `SUVIDHA-Receipt-${this.orderId}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.downloading = false;
            },
            error: (err) => {
                console.error('Failed to download receipt:', err);
                this.downloading = false;
                alert('Failed to download receipt. Please contact support.');
            }
        });
    }

    printReceipt() {
        window.print();
    }

    finish() {
        // Return to dashboard (idle timer continues independently)
        this.router.navigate(['/dashboard']);
    }
}


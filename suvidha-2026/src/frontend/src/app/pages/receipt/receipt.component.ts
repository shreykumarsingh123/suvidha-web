import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
                    <div class="flex justify-between"><span>Txn ID:</span><span class="text-slate-900 font-bold">{{txnId}}</span></div>
                    <div class="border-b border-slate-100 my-2"></div>
                    <div class="flex justify-between font-bold text-xl text-slate-900"><span>PAID:</span><span>₹1,240</span></div>
                </div>
                
                <div class="mt-8 pt-4 border-t-2 border-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 mx-auto text-green-600 mb-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <p class="text-xs font-bold text-green-700 uppercase">Payment Successful</p>
                </div>
                
                <!-- Jagged Edge -->
                <div class="absolute bottom-0 left-0 w-full h-3 bg-slate-900" style="clip-path: polygon(0% 100%, 2% 0%, 4% 100%, 6% 0%, 8% 100%, 10% 0%, 12% 100%, 14% 0%, 16% 100%, 18% 0%, 20% 100%, 22% 0%, 24% 100%, 26% 0%, 28% 100%, 30% 0%, 32% 100%, 34% 0%, 36% 100%, 38% 0%, 40% 100%, 42% 0%, 44% 100%, 46% 0%, 48% 100%, 50% 0%, 52% 100%, 54% 0%, 56% 100%, 58% 0%, 60% 100%, 62% 0%, 64% 100%, 66% 0%, 68% 100%, 70% 0%, 72% 100%, 74% 0%, 76% 100%, 78% 0%, 80% 100%, 82% 0%, 84% 100%, 86% 0%, 88% 100%, 90% 0%, 92% 100%, 94% 0%, 96% 100%, 98% 0%, 100% 100%);"></div>
            </div>
        </div>
        
        <button (click)="finish()" class="mt-10 px-10 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] cursor-pointer">
            Collect & Home
        </button>
    </div>
  `
})
export class ReceiptComponent {
    router = inject(Router);
    
    today = new Date().toLocaleDateString('en-GB');
    txnId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    finish() {
        this.router.navigate(['/dashboard']);
    }
}


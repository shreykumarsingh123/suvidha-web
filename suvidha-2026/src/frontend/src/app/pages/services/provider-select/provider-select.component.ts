import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VirtualKeyboardComponent } from '../../../components/virtual-keyboard/virtual-keyboard.component';

@Component({
    selector: 'app-provider-select',
    standalone: true,
    imports: [CommonModule, VirtualKeyboardComponent],
    template: `
    <div id="provider-select" class="screen active justify-center items-center bg-slate-100 p-6 overflow-y-auto flex h-screen w-full">
        <div class="w-full h-full flex items-center justify-center pt-28 pb-10">
            <div class="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-enter p-10">
                <div class="flex items-center justify-between mb-10">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 mb-2">Select Provider</h2>
                        <p class="text-slate-500 text-lg">Choose your service provider / सेवा प्रदाता चुनें</p>
                    </div>
                    <button (click)="goBack()" class="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-slate-600"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                
                <!-- Search Input -->
                <div class="mb-8">
                    <div class="relative">
                        <input type="text" 
                               [value]="searchTerm"
                               (click)="openKeyboard()"
                               readonly
                               placeholder="🔍 Tap to search provider / प्रदाता खोजें"
                               class="w-full px-6 py-5 text-xl bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none cursor-pointer transition-colors placeholder:text-slate-400 text-slate-700 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-400 w-8 h-8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <p *ngIf="searchTerm" class="text-slate-500 text-lg mt-3 text-center">
                        Showing {{filteredProviders.length}} result{{filteredProviders.length !== 1 ? 's' : ''}} for "{{searchTerm}}"
                    </p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Providers based on service type -->
                    <ng-container *ngFor="let provider of filteredProviders">
                        <div class="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group h-40" (click)="selectProvider(provider.name)">
                            <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                            </div>
                            <span class="font-bold text-slate-700 text-center leading-tight group-hover:text-blue-700">{{provider.name}}</span>
                        </div>
                    </ng-container>
                    
                    <!-- No results message -->
                    <ng-container *ngIf="filteredProviders.length === 0">
                        <div class="col-span-full flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-slate-100 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400 mb-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <p class="text-slate-600 text-xl font-semibold">No providers found</p>
                            <p class="text-slate-400 text-lg mt-2">Try a different search term</p>
                        </div>
                    </ng-container>
                </div>
            </div>
        </div>
        
        <!-- Virtual Keyboard -->
        <app-virtual-keyboard 
            *ngIf="showKeyboard" 
            (keyPressed)="onKeyPress($event)"
            (close)="closeKeyboard()">
        </app-virtual-keyboard>
    </div>
  `
})
export class ProviderSelectComponent implements OnInit {
    serviceType = '';
    providers: any[] = [];
    filteredProviders: any[] = [];
    searchTerm = '';
    showKeyboard = false;
    
    router = inject(Router);
    route = inject(ActivatedRoute);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.serviceType = params['type'] || 'elec';
            this.loadProviders();
        });
    }

    loadProviders() {
        const providerData: any = {
            'elec': [
                { name: 'Adani Electricity' },
                { name: 'Tata Power DDL' },
                { name: 'BSES Rajdhani' },
                { name: 'BSES Yamuna' },
                { name: 'NPDCL North' },
                { name: 'SPDCL South' }
            ],
            'water': [
                { name: 'Delhi Jal Board' },
                { name: 'Municipal Corp.' },
                { name: 'UP Jal Nigam' },
                { name: 'PHED Water' }
            ],
            'gas': [
                { name: 'Indraprastha Gas' },
                { name: 'Mahanagar Gas' },
                { name: 'Adani Gas Ltd' },
                { name: 'Gujarat Gas' },
                { name: 'Indane Piped' }
            ],
            'muni': [
                { name: 'Municipal Corp (North)' },
                { name: 'Municipal Corp (South)' },
                { name: 'Municipal Corp (East)' },
                { name: 'Cantonment Board' }
            ]
        };
        this.providers = providerData[this.serviceType] || providerData['elec'];
        this.filterProviders();
    }

    filterProviders() {
        if (!this.searchTerm.trim()) {
            this.filteredProviders = [...this.providers];
        } else {
            const term = this.searchTerm.toLowerCase().trim();
            this.filteredProviders = this.providers.filter(provider => 
                provider.name.toLowerCase().includes(term)
            );
        }
    }

    openKeyboard() {
        this.showKeyboard = true;
    }

    closeKeyboard() {
        this.showKeyboard = false;
    }

    onKeyPress(key: string) {
        if (key === 'BACKSPACE') {
            this.searchTerm = this.searchTerm.slice(0, -1);
        } else if (key === 'CLEAR') {
            this.searchTerm = '';
        } else {
            this.searchTerm += key;
        }
        this.filterProviders();
    }

    selectProvider(name: string) {
        this.router.navigate(['/consumer-input'], { queryParams: { type: this.serviceType, provider: name } });
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}


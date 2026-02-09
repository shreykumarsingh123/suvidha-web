import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VirtualKeyboardComponent } from '../../../components/virtual-keyboard/virtual-keyboard.component';

@Component({
    selector: 'app-provider-select',
    standalone: true,
    imports: [CommonModule, VirtualKeyboardComponent],
    template: `
    <div id="provider-select" class="screen active bg-slate-100 overflow-y-auto flex h-screen w-full pt-28 pb-8 px-8">
        <!-- Main Container with Split View -->
        <div class="w-full h-full flex gap-6 justify-center max-w-[1600px] mx-auto">
            
            <!-- LEFT PANEL: Provider Grid & Search -->
            <div class="flex-1 max-w-[730px] bg-white rounded-[2rem] shadow-xl border border-slate-200 flex flex-col animate-enter overflow-hidden relative">
                <!-- Header Area -->
                <div class="p-8 pb-4 flex items-center justify-between border-b border-slate-100">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 mb-1">Select Provider</h2>
                        <p class="text-slate-500 font-medium">Choose your service provider / सेवा प्रदाता चुनें</p>
                    </div>
                    <button (click)="goBack()" class="p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-slate-600"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>

                <!-- Search Bar (Fixed in Panel) -->
                <div class="px-8 py-6 bg-slate-50/50">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </div>
                        <input type="text" 
                               [value]="searchTerm"
                               readonly
                               placeholder="Type on side keyboard... / साइड कीबोर्ड पर टाइप करें..."
                               class="w-full pl-14 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl text-xl font-bold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 transition-colors cursor-text">
                    </div>
                    <p *ngIf="searchTerm" class="text-slate-500 text-sm mt-3 text-center">
                        Showing {{filteredProviders.length}} result{{filteredProviders.length !== 1 ? 's' : ''}} for "{{searchTerm}}"
                    </p>
                </div>
                
                <!-- Scrollable Grid Area -->
                <div class="flex-1 overflow-y-auto p-8 pt-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Providers based on service type -->
                        <ng-container *ngFor="let provider of filteredProviders">
                            <div class="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group h-40" (click)="selectProvider(provider.name)">
                                <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <!-- Dynamic icon based on provider type -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [attr.class]="provider.iconClass">
                                        <ng-container [ngSwitch]="provider.icon">
                                            <ng-container *ngSwitchCase="'zap'"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></ng-container>
                                            <ng-container *ngSwitchCase="'droplets'"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></ng-container>
                                            <ng-container *ngSwitchCase="'flame'"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0 1.1.2 2.2.5 3.3a9 9 0 0 0 .9-3.8c.3-.3.6-.6.9-.9a5 5 0 0 0 1.2-3.2c.4.5.8 1 1.2 1.5L12 13l2.2 2.2a4 4 0 0 0 2.8-6.5c-.6-.4-1.2-.9-1.8-1.2a8 8 0 0 1-2.2 4.5"/></ng-container>
                                            <ng-container *ngSwitchCase="'building'"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></ng-container>
                                            <ng-container *ngSwitchDefault><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></ng-container>
                                        </ng-container>
                                    </svg>
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

            <!-- RIGHT PANEL: Fixed Virtual Keyboard -->
            <div class="w-[850px] hidden lg:flex">
                <app-virtual-keyboard 
                    (keyPressed)="onKeyPress($event)"
                    style="width: 100%; height: 100%;">
                </app-virtual-keyboard>
            </div>
        </div>
    </div>
  `
})
export class ProviderSelectComponent implements OnInit {
    serviceType = '';
    providers: any[] = [];
    filteredProviders: any[] = [];
    searchTerm = '';
    
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
                { name: 'Adani Electricity', icon: 'zap', iconClass: 'text-yellow-500' },
                { name: 'Tata Power DDL', icon: 'zap', iconClass: 'text-blue-500' },
                { name: 'BSES Rajdhani', icon: 'zap', iconClass: 'text-red-500' },
                { name: 'BSES Yamuna', icon: 'zap', iconClass: 'text-orange-500' },
                { name: 'NPDCL North', icon: 'zap', iconClass: 'text-green-500' },
                { name: 'SPDCL South', icon: 'zap', iconClass: 'text-purple-500' }
            ],
            'water': [
                { name: 'Delhi Jal Board', icon: 'droplets', iconClass: 'text-blue-500' },
                { name: 'Municipal Corp.', icon: 'droplets', iconClass: 'text-cyan-500' },
                { name: 'UP Jal Nigam', icon: 'droplets', iconClass: 'text-indigo-500' },
                { name: 'PHED Water', icon: 'droplets', iconClass: 'text-sky-500' }
            ],
            'gas': [
                { name: 'Indraprastha Gas', icon: 'flame', iconClass: 'text-orange-500' },
                { name: 'Mahanagar Gas', icon: 'flame', iconClass: 'text-red-500' },
                { name: 'Adani Gas Ltd', icon: 'flame', iconClass: 'text-yellow-500' },
                { name: 'Gujarat Gas', icon: 'flame', iconClass: 'text-amber-500' },
                { name: 'Indane Piped', icon: 'flame', iconClass: 'text-green-500' }
            ],
            'muni': [
                { name: 'Municipal Corp (North)', icon: 'building', iconClass: 'text-slate-600' },
                { name: 'Municipal Corp (South)', icon: 'building', iconClass: 'text-slate-600' },
                { name: 'Municipal Corp (East)', icon: 'building', iconClass: 'text-slate-600' },
                { name: 'Cantonment Board', icon: 'building', iconClass: 'text-slate-600' }
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

    onKeyPress(key: string) {
        if (key === 'BACKSPACE') {
            this.searchTerm = this.searchTerm.slice(0, -1);
        } else if (key === 'ENTER') {
            // Optional: Action on Enter - could auto-select first provider
            if (this.filteredProviders.length === 1) {
                this.selectProvider(this.filteredProviders[0].name);
            }
        } else if (key === ' ') {
            // Ignore space for search
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


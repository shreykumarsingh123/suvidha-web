import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-provider-select',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="provider-select" class="screen active justify-center items-center bg-slate-100 p-6 overflow-y-auto flex h-screen w-full">
         <div class="w-full h-full flex items-center justify-center pt-28 pb-10">
            <div class="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[600px] animate-enter">
                <!-- Header -->
                <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <h2 class="text-3xl font-black text-slate-800">Select Provider</h2>
                        <p class="text-slate-500 font-medium">Choose your service provider to proceed</p>
                    </div>
                    <button (click)="cancel()" class="p-3 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <!-- Grid -->
                <div class="p-8 overflow-y-auto flex-1">
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                        @for (prov of providers; track prov.name) {
                            <div (click)="selectProvider(prov.name)" class="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group h-40">
                                <div class="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <!-- Dynamic Icon Logic Simpler here for demo -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                </div>
                                <span class="font-bold text-slate-700 text-center leading-tight group-hover:text-blue-700">{{prov.name}}</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
         </div>
    </div>
  `
})
export class ProviderSelectComponent {
    providers: any[] = [];
    serviceType: string = '';

    // Data Map
    private providerMap: any = {
        'elec': [
            { name: 'Adani Electricity' }, { name: 'Tata Power DDL' },
            { name: 'BSES Rajdhani' }, { name: 'BSES Yamuna' },
            { name: 'NPDCL North' }, { name: 'SPDCL South' }
        ],
        'water': [
            { name: 'Delhi Jal Board' }, { name: 'Municipal Corp.' },
            { name: 'UP Jal Nigam' }, { name: 'PHED Water' }
        ],
        'gas': [
            { name: 'Indraprastha Gas' }, { name: 'Mahanagar Gas' },
            { name: 'Adani Gas Ltd' }, { name: 'Gujarat Gas' }
        ],
        'muni': [
            { name: 'Municipal Corp (North)' }, { name: 'Municipal Corp (South)' },
            { name: 'Cantonment Board' }
        ]
    };

    constructor(private router: Router, private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.serviceType = params['type'] || 'elec';
            this.providers = this.providerMap[this.serviceType] || [];
        });
    }

    selectProvider(name: string) {
        this.router.navigate(['/consumer-input'], {
            queryParams: {
                provider: name,
                serviceType: this.serviceType
            }
        });
    }

    cancel() {
        this.router.navigate(['/dashboard']);
    }
}

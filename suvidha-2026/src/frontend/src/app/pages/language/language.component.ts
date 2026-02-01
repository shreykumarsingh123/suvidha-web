import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-language',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div id="language" class="screen active justify-center items-center bg-slate-100 p-6 overflow-y-auto flex h-screen w-full">
        <div class="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-200 relative animate-enter my-auto">
            <h2 class="text-4xl font-bold text-slate-800 text-center mb-10">Select Language / भाषा चुनें</h2>
            <div class="grid gap-6">
                <button (click)="selectLanguage('EN')" class="group w-full flex items-center justify-between p-8 bg-slate-50 hover:bg-blue-50 rounded-3xl border-2 border-slate-200 hover:border-blue-500 transition-all shadow-sm hover:shadow-lg cursor-pointer">
                    <div class="flex items-center gap-6">
                        <div class="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-3xl border-2 border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">Aa</div>
                        <div class="text-left">
                            <span class="block text-3xl font-bold text-slate-800">English</span>
                            <span class="text-sm text-slate-500 uppercase tracking-wider font-bold">Default</span>
                        </div>
                    </div>
                </button>
                <button (click)="selectLanguage('HI')" class="group w-full flex items-center justify-between p-8 bg-slate-50 hover:bg-blue-50 rounded-3xl border-2 border-slate-200 hover:border-blue-500 transition-all shadow-sm hover:shadow-lg cursor-pointer">
                    <div class="flex items-center gap-6">
                        <div class="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-3xl border-2 border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">अ</div>
                        <div class="text-left">
                            <span class="block text-3xl font-bold text-slate-800">हिंदी</span>
                            <span class="text-sm text-slate-500 uppercase tracking-wider font-bold">राजभाषा</span>
                        </div>
                    </div>
                </button>
            </div>
            <div class="mt-10 text-center">
                <button (click)="goBack()" class="px-8 py-4 rounded-full text-slate-400 font-bold hover:bg-slate-100 hover:text-slate-700 transition-colors flex items-center gap-2 mx-auto cursor-pointer">
                     Cancel / रद्द करें
                </button>
            </div>
        </div>
    </div>
  `
})
export class LanguageComponent {
    constructor(private router: Router) { }

    selectLanguage(lang: string) {
        localStorage.setItem('language', lang);
        this.router.navigate(['/login']);
    }

    goBack() {
        this.router.navigate(['/welcome']);
    }
}

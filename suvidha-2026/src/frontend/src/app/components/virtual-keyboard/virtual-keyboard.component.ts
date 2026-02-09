import { Component, EventEmitter, Output, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const lucide: any;

@Component({
    selector: 'app-virtual-keyboard',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="w-full h-full bg-slate-200 rounded-[2rem] shadow-xl border border-slate-300 flex flex-col p-6 animate-enter">
            <div class="flex-1 flex flex-col justify-center gap-3">
                <!-- Row 1: QWERTY Top Row -->
                <div class="flex justify-center gap-2 w-full">
                    <button *ngFor="let key of topRow" 
                            (click)="onKeyPress(key)"
                            class="key-btn flex-1 cursor-pointer">
                        {{key}}
                    </button>
                </div>
                
                <!-- Row 2: ASDF Middle Row with spacers -->
                <div class="flex justify-center gap-2 w-full">
                    <div class="w-[4%]"></div> <!-- Spacer -->
                    <button *ngFor="let key of middleRow" 
                            (click)="onKeyPress(key)"
                            class="key-btn flex-1 cursor-pointer">
                        {{key}}
                    </button>
                    <div class="w-[4%]"></div> <!-- Spacer -->
                </div>
                
                <!-- Row 3: ZXCV Bottom Row with special keys -->
                <div class="flex justify-center gap-2 w-full">
                    <button (click)="onBackspace()" 
                            class="key-btn flex-[1.5] bg-slate-300 cursor-pointer">
                        <i data-lucide="delete" class="w-8 h-8"></i>
                    </button>
                    <button *ngFor="let key of bottomRow" 
                            (click)="onKeyPress(key)"
                            class="key-btn flex-1 cursor-pointer">
                        {{key}}
                    </button>
                    <button (click)="onEnter()"
                            class="key-btn flex-[1.5] cursor-pointer">
                        Enter
                    </button>
                </div>
                
                <!-- Row 4: Spacebar -->
                <div class="flex justify-center gap-2 w-full mt-2">
                    <button (click)="onSpace()" 
                            class="key-btn w-[60%] cursor-pointer">
                        SPACE
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .key-btn {
            @apply bg-white rounded-xl font-bold text-slate-700 text-2xl;
            border-bottom-width: 6px;
            border-color: #cbd5e1;
            height: 5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.1s;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }
        
        .key-btn:active {
            border-bottom-width: 0px;
            transform: translateY(4px);
            background-color: #f1f5f9;
        }
        
        .key-btn:hover {
            background-color: #f8fafc;
            transform: translateY(-1px);
        }
    `]
})
export class VirtualKeyboardComponent implements AfterViewInit, OnDestroy {
    @Output() keyPressed = new EventEmitter<string>();
    @Output() close = new EventEmitter<void>();

    topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    bottomRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

    ngAfterViewInit() {
        // Initialize Lucide icons after view is ready
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    ngOnDestroy() {
        // Clean up if needed
    }

    onKeyPress(key: string) {
        this.keyPressed.emit(key);
    }

    onBackspace() {
        this.keyPressed.emit('BACKSPACE');
    }

    onEnter() {
        this.keyPressed.emit('ENTER');
    }

    onSpace() {
        this.keyPressed.emit(' ');
    }

    closeKeyboard() {
        this.close.emit();
    }
}


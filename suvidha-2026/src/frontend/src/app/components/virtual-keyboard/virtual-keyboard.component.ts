import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-virtual-keyboard',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="keyboard-container fixed bottom-0 left-0 right-0 bg-slate-800 p-4 shadow-2xl z-50 animate-slide-up">
            <!-- Header with close button -->
            <div class="flex justify-between items-center mb-4">
                <span class="text-white text-lg font-semibold">Virtual Keyboard</span>
                <button (click)="closeKeyboard()" 
                        class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer active:scale-95">
                    ✕ Close
                </button>
            </div>
            
            <!-- Number row -->
            <div class="flex justify-center gap-2 mb-3">
                <button *ngFor="let key of numberKeys"
                        (click)="onKeyPress(key)"
                        class="key-button bg-slate-700 hover:bg-slate-600 text-white text-xl font-bold py-4 px-5 rounded-xl transition-all cursor-pointer active:scale-95">
                    {{key}}
                </button>
            </div>
            
            <!-- Letter rows -->
            <div *ngFor="let row of keyboardRows" class="flex justify-center gap-2 mb-3">
                <button *ngFor="let key of row"
                        (click)="onKeyPress(key)"
                        class="key-button bg-slate-700 hover:bg-slate-600 text-white text-xl font-bold py-4 px-6 rounded-xl transition-all cursor-pointer active:scale-95">
                    {{key}}
                </button>
            </div>
            
            <!-- Special keys row -->
            <div class="flex justify-center gap-3">
                <button (click)="onKeyPress(' ')" 
                        class="key-button bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-4 px-16 rounded-xl transition-all cursor-pointer active:scale-95">
                    SPACE
                </button>
                <button (click)="onBackspace()" 
                        class="key-button bg-orange-500 hover:bg-orange-400 text-white text-xl font-bold py-4 px-8 rounded-xl transition-all cursor-pointer active:scale-95">
                    ⌫ Backspace
                </button>
                <button (click)="onClear()" 
                        class="key-button bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-4 px-6 rounded-xl transition-all cursor-pointer active:scale-95">
                    Clear
                </button>
            </div>
        </div>
    `,
    styles: [`
        @keyframes slide-up {
            from {
                transform: translateY(100%);
            }
            to {
                transform: translateY(0);
            }
        }
        
        .animate-slide-up {
            animation: slide-up 0.3s ease-out;
        }
        
        .key-button {
            min-width: 60px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }
        
        @media (min-width: 768px) {
            .key-button {
                min-width: 70px;
                height: 80px;
            }
        }
    `]
})
export class VirtualKeyboardComponent {
    @Output() keyPressed = new EventEmitter<string>();
    @Output() close = new EventEmitter<void>();

    numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    onKeyPress(key: string) {
        this.keyPressed.emit(key);
    }

    onBackspace() {
        this.keyPressed.emit('BACKSPACE');
    }

    onClear() {
        this.keyPressed.emit('CLEAR');
    }

    closeKeyboard() {
        this.close.emit();
    }
}


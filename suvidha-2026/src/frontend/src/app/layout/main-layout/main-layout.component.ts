import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, HeaderComponent],
    template: `
    <app-header></app-header>
    <main class="w-full h-full">
        <router-outlet></router-outlet>
    </main>
  `
})
export class MainLayoutComponent { }

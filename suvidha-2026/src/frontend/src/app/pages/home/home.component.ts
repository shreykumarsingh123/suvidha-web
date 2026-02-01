import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}

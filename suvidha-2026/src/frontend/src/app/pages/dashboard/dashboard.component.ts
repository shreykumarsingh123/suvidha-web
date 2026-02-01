import { Component } from '@angular/core';
import { HeaderComponent } from '../../core/header/header.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {}

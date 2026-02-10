import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert } from '../../core/services/alert.service';

@Component({
    selector: 'app-alert-banner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngFor="let alert of alerts" 
         class="mb-4 rounded-lg p-4 flex items-start gap-3 animate-slide-down"
         [ngClass]="{
           'bg-red-50 border border-red-200': alert.severity === 'critical' || alert.severity === 'high',
           'bg-yellow-50 border border-yellow-200': alert.severity === 'warning' || alert.severity === 'medium',
           'bg-blue-50 border border-blue-200': alert.severity === 'info' || alert.severity === 'low'
         }">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <svg *ngIf="alert.severity === 'critical' || alert.severity === 'high'" 
             class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <svg *ngIf="alert.severity === 'warning' || alert.severity === 'medium'" 
             class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg *ngIf="alert.severity === 'info' || alert.severity === 'low'" 
             class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <h4 class="font-semibold mb-1"
            [ngClass]="{
              'text-red-800': alert.severity === 'critical' || alert.severity === 'high',
              'text-yellow-800': alert.severity === 'warning' || alert.severity === 'medium',
              'text-blue-800': alert.severity === 'info' || alert.severity === 'low'
            }">
          {{ alert.title }}
        </h4>
        <p class="text-sm"
           [ngClass]="{
             'text-red-700': alert.severity === 'critical' || alert.severity === 'high',
             'text-yellow-700': alert.severity === 'warning' || alert.severity === 'medium',
             'text-blue-700': alert.severity === 'info' || alert.severity === 'low'
           }">
          {{ alert.message }}
        </p>
      </div>
    </div>
  `,
    styles: [`
    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-slide-down {
      animation: slide-down 0.3s ease-out;
    }
  `]
})
export class AlertBannerComponent implements OnInit {
    private alertService = inject(AlertService);
    alerts: Alert[] = [];

    ngOnInit() {
        this.loadAlerts();
    }

    loadAlerts() {
        this.alertService.getActiveAlerts().subscribe({
            next: (response) => {
                if (response.success) {
                    this.alerts = response.data;
                }
            },
            error: (error) => {
                console.error('Error loading alerts:', error);
            }
        });
    }
}

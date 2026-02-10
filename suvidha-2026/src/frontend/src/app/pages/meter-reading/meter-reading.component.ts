import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-meter-reading',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <button (click)="goBack()" class="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Submit Meter Reading</h1>
          <p class="text-gray-600 mt-2">Submit your current meter reading for accurate billing</p>
        </div>

        <!-- Service Selection -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Select Service</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              *ngFor="let service of services"
              (click)="selectService(service.value)"
              [class.ring-4]="selectedService === service.value"
              [class.ring-blue-500]="selectedService === service.value"
              class="p-6 border-2 rounded-xl hover:border-blue-500 transition-all text-center">
              <div class="text-4xl mb-2">{{ service.icon }}</div>
              <h3 class="font-semibold text-gray-900">{{ service.label }}</h3>
            </button>
          </div>
        </div>

        <!-- Reading Form -->
        <div *ngIf="selectedService" class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Enter Reading Details</h2>
          
          <form (ngSubmit)="submitReading()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Consumer Number *</label>
              <input
                type="text"
                [(ngModel)]="formData.consumerNumber"
                name="consumerNumber"
                required
                placeholder="Enter your consumer number"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Reading *</label>
              <input
                type="number"
                [(ngModel)]="formData.currentReading"
                name="currentReading"
                required
                min="0"
                placeholder="Enter current meter reading"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <p class="text-sm text-gray-500 mt-2">Enter the reading as shown on your meter</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Previous Reading</label>
              <input
                type="number"
                [(ngModel)]="formData.previousReading"
                name="previousReading"
                readonly
                placeholder="Will be auto-filled"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
            </div>

            <div *ngIf="formData.currentReading && formData.previousReading" 
                 class="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700">Consumption:</span>
                <span class="text-2xl font-bold text-blue-600">
                  {{ formData.currentReading - formData.previousReading }} units
                </span>
              </div>
            </div>

            <!-- Photo Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Upload Meter Photo (Optional)</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  (change)="onFileSelect($event)"
                  accept="image/*"
                  class="hidden"
                  #fileInput>
                <button
                  type="button"
                  (click)="fileInput.click()"
                  class="text-blue-600 hover:text-blue-700 font-medium">
                  <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Click to upload photo
                </button>
                <p class="text-sm text-gray-500 mt-2">JPG, PNG (Max 5MB)</p>
              </div>
              <div *ngIf="selectedFile" class="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span class="text-sm text-gray-700">{{ selectedFile.name }}</span>
                <button
                  type="button"
                  (click)="removeFile()"
                  class="text-red-600 hover:text-red-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="submitting()"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!submitting()">Submit Reading</span>
              <span *ngIf="submitting()" class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            </button>
          </form>
        </div>

        <!-- Success Modal -->
        <div *ngIf="submitted()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Reading Submitted!</h3>
            <p class="text-gray-600 mb-4">Your meter reading has been recorded successfully.</p>
            <div class="bg-blue-50 rounded-lg p-4 mb-6">
              <p class="text-sm text-gray-600 mb-1">Consumption</p>
              <p class="text-2xl font-bold text-blue-600">{{ consumption() }} units</p>
            </div>
            <button
              (click)="goBack()"
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class MeterReadingComponent {
    private http = inject(HttpClient);
    private router = inject(Router);

    services = [
        { value: 'electricity', label: 'Electricity', icon: '⚡' },
        { value: 'water', label: 'Water', icon: '💧' },
        { value: 'gas', label: 'Gas', icon: '🔥' }
    ];

    selectedService = '';
    selectedFile: File | null = null;
    submitting = signal(false);
    submitted = signal(false);
    consumption = signal(0);

    formData = {
        consumerNumber: '',
        currentReading: 0,
        previousReading: 0
    };

    selectService(service: string) {
        this.selectedService = service;
        // Simulate fetching previous reading
        this.formData.previousReading = Math.floor(Math.random() * 1000) + 500;
    }

    onFileSelect(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    removeFile() {
        this.selectedFile = null;
    }

    submitReading() {
        this.submitting.set(true);

        const formData = new FormData();
        formData.append('serviceType', this.selectedService);
        formData.append('consumerNumber', this.formData.consumerNumber);
        formData.append('currentReading', this.formData.currentReading.toString());
        formData.append('previousReading', this.formData.previousReading.toString());

        if (this.selectedFile) {
            formData.append('photo', this.selectedFile);
        }

        // Simulate API call
        setTimeout(() => {
            this.submitting.set(false);
            this.submitted.set(true);
            this.consumption.set(this.formData.currentReading - this.formData.previousReading);
        }, 2000);
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-new-connection',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <button (click)="goBack()" class="flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          <h1 class="text-3xl font-bold text-gray-900">New Connection Application</h1>
          <p class="text-gray-600 mt-2">Apply for a new service connection</p>
        </div>

        <!-- Service Type Selection -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Select Service Type</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              *ngFor="let service of serviceTypes"
              (click)="selectService(service.value)"
              [class.ring-4]="selectedService === service.value"
              [class.ring-blue-500]="selectedService === service.value"
              class="p-6 border-2 rounded-xl hover:border-blue-500 transition-all text-center">
              <div class="text-4xl mb-3">{{ service.icon }}</div>
              <h3 class="font-semibold text-gray-900">{{ service.label }}</h3>
            </button>
          </div>
        </div>

        <!-- Application Form -->
        <div *ngIf="selectedService" class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Application Details</h2>
          
          <form (ngSubmit)="submitApplication()" class="space-y-6">
            <!-- Personal Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.applicantName"
                  name="applicantName"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  [(ngModel)]="formData.mobileNumber"
                  name="mobileNumber"
                  required
                  maxlength="10"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  [(ngModel)]="formData.email"
                  name="email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ID Proof Type *</label>
                <select
                  [(ngModel)]="formData.idProofType"
                  name="idProofType"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select ID Proof</option>
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="voter">Voter ID</option>
                  <option value="passport">Passport</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">ID Proof Number *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.idProofNumber"
                  name="idProofNumber"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>

            <!-- Address Details -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Address Details</h3>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                <textarea
                  [(ngModel)]="formData.address"
                  name="address"
                  required
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.city"
                    name="city"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.state"
                    name="state"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.pincode"
                    name="pincode"
                    required
                    maxlength="6"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
              </div>
            </div>

            <!-- Document Upload -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  (change)="onFileSelect($event)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  class="hidden"
                  #fileInput>
                <button
                  type="button"
                  (click)="fileInput.click()"
                  class="text-blue-600 hover:text-blue-700 font-medium">
                  <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  Click to upload documents
                </button>
                <p class="text-sm text-gray-500 mt-2">PDF, JPG, PNG (Max 5MB each)</p>
              </div>
              <div *ngIf="selectedFiles.length > 0" class="mt-4 space-y-2">
                <div *ngFor="let file of selectedFiles; let i = index" 
                     class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span class="text-sm text-gray-700">{{ file.name }}</span>
                  <button
                    type="button"
                    (click)="removeFile(i)"
                    class="text-red-600 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex gap-4">
              <button
                type="submit"
                [disabled]="submitting()"
                class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <span *ngIf="!submitting()">Submit Application</span>
                <span *ngIf="submitting()" class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Success Message -->
        <div *ngIf="applicationNumber()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p class="text-gray-600 mb-4">Your application has been submitted successfully.</p>
            <div class="bg-blue-50 rounded-lg p-4 mb-6">
              <p class="text-sm text-gray-600 mb-1">Application Number</p>
              <p class="text-2xl font-bold text-blue-600">{{ applicationNumber() }}</p>
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
export class NewConnectionComponent {
    private http = inject(HttpClient);
    private router = inject(Router);

    serviceTypes = [
        { value: 'electricity', label: 'Electricity', icon: '⚡' },
        { value: 'water', label: 'Water', icon: '💧' },
        { value: 'gas', label: 'Gas', icon: '🔥' }
    ];

    selectedService = '';
    selectedFiles: File[] = [];
    submitting = signal(false);
    applicationNumber = signal('');

    formData = {
        applicantName: '',
        mobileNumber: '',
        email: '',
        idProofType: '',
        idProofNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    };

    selectService(service: string) {
        this.selectedService = service;
    }

    onFileSelect(event: any) {
        const files = Array.from(event.target.files) as File[];
        this.selectedFiles.push(...files);
    }

    removeFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }

    submitApplication() {
        this.submitting.set(true);

        const formData = new FormData();
        formData.append('serviceType', this.selectedService);
        formData.append('applicantName', this.formData.applicantName);
        formData.append('mobileNumber', this.formData.mobileNumber);
        formData.append('email', this.formData.email);
        formData.append('idProofType', this.formData.idProofType);
        formData.append('idProofNumber', this.formData.idProofNumber);
        formData.append('address', this.formData.address);
        formData.append('city', this.formData.city);
        formData.append('state', this.formData.state);
        formData.append('pincode', this.formData.pincode);

        this.selectedFiles.forEach((file, index) => {
            formData.append(`documents`, file);
        });

        // Simulate API call (replace with actual API)
        setTimeout(() => {
            this.submitting.set(false);
            this.applicationNumber.set(`${this.selectedService.substring(0, 3).toUpperCase()}${Date.now()}`);
        }, 2000);
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}

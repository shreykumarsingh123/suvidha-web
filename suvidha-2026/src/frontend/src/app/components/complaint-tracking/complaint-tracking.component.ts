import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComplaintService } from '../../services/complaint.service';

interface Complaint {
    id: number;
    title: string;
    description: string;
    complaint_type: string;
    location: string;
    priority: string;
    status: string;
    created_at: string;
    assigned_officer?: string;
}

@Component({
    selector: 'app-complaint-tracking',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-bold text-slate-900 mb-2">Track Complaints</h1>
            <p class="text-slate-600">Monitor the status of your municipal complaints</p>
          </div>
          <button (click)="goBack()" class="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors">
            ← Back to Dashboard
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-slate-600">Loading complaints...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !loading" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p class="text-red-700">{{ error }}</p>
          <button (click)="loadComplaints()" class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
            Try Again
          </button>
        </div>

        <!-- Complaints List -->
        <div *ngIf="!loading && !error" class="space-y-4">
          <!-- Empty State -->
          <div *ngIf="complaints.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-2xl font-bold text-slate-900 mb-2">No Complaints Yet</h3>
            <p class="text-slate-600 mb-6">You haven't registered any municipal complaints</p>
            <button (click)="router.navigate(['/complaints'])" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
              Register New Complaint
            </button>
          </div>

          <!-- Complaint Cards -->
          <div *ngFor="let complaint of complaints" class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-2xl">{{ getComplaintIcon(complaint.complaint_type) }}</span>
                    <h3 class="text-xl font-bold text-slate-900">{{ complaint.title }}</h3>
                  </div>
                  <p class="text-slate-600">{{ complaint.description }}</p>
                </div>
                <span [ngClass]="getStatusClass(complaint.status)" class="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ml-4">
                  {{ complaint.status }}
                </span>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200">
                <div>
                  <p class="text-xs text-slate-500 mb-1">Type</p>
                  <p class="font-semibold text-slate-900">{{ complaint.complaint_type }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 mb-1">Location</p>
                  <p class="font-semibold text-slate-900">{{ complaint.location }}</p>
                </div>
                <div>
                  <p class="text-xs text-slate-500 mb-1">Priority</p>
                  <span [ngClass]="getPriorityClass(complaint.priority)" class="inline-block px-3 py-1 rounded-full text-xs font-bold">
                    {{ complaint.priority }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-slate-500 mb-1">Submitted</p>
                  <p class="font-semibold text-slate-900">{{ formatDate(complaint.created_at) }}</p>
                </div>
              </div>

              <div *ngIf="complaint.assigned_officer" class="mt-4 pt-4 border-t border-slate-200">
                <p class="text-sm text-slate-600">
                  <span class="font-semibold">Assigned Officer:</span> {{ complaint.assigned_officer }}
                </p>
              </div>

              <!-- Progress Bar -->
              <div class="mt-4">
                <div class="flex justify-between text-xs text-slate-600 mb-2">
                  <span>Progress</span>
                  <span>{{ getProgressPercentage(complaint.status) }}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2">
                  <div [style.width.%]="getProgressPercentage(complaint.status)" 
                       [ngClass]="getProgressBarClass(complaint.status)"
                       class="h-2 rounded-full transition-all duration-300">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class ComplaintTrackingComponent implements OnInit {
    complaintService = inject(ComplaintService);
    router = inject(Router);

    complaints: Complaint[] = [];
    loading = true;
    error = '';

    ngOnInit() {
        this.loadComplaints();
    }

    loadComplaints() {
        this.loading = true;
        this.error = '';

        this.complaintService.getAllComplaints().subscribe({
            next: (data: any) => {
                this.complaints = data;
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Error loading complaints:', err);
                this.error = 'Failed to load complaints. Please try again.';
                this.loading = false;
            }
        });
    }

    getComplaintIcon(type: string): string {
        const icons: Record<string, string> = {
            'Road Repair': '🛣️',
            'Street Light': '💡',
            'Garbage Collection': '🗑️',
            'Water Supply': '💧',
            'Drainage': '🚰',
            'Other': '📋'
        };
        return icons[type] || '📋';
    }

    getStatusClass(status: string): string {
        const classes: Record<string, string> = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            'Resolved': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800'
        };
        return classes[status] || 'bg-slate-100 text-slate-800';
    }

    getPriorityClass(priority: string): string {
        const classes: Record<string, string> = {
            'Low': 'bg-green-100 text-green-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'High': 'bg-red-100 text-red-800'
        };
        return classes[priority] || 'bg-slate-100 text-slate-800';
    }

    getProgressPercentage(status: string): number {
        const progress: Record<string, number> = {
            'Pending': 25,
            'In Progress': 60,
            'Resolved': 100,
            'Rejected': 0
        };
        return progress[status] || 0;
    }

    getProgressBarClass(status: string): string {
        const classes: Record<string, string> = {
            'Pending': 'bg-yellow-500',
            'In Progress': 'bg-blue-500',
            'Resolved': 'bg-green-500',
            'Rejected': 'bg-red-500'
        };
        return classes[status] || 'bg-slate-500';
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}

import { Component, OnInit, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

declare const lucide: any;

interface RevenueStats {
  summary: {
    totalRevenue: number;
    totalBills: number;
    byCategory: {
      [key: string]: {
        totalBills: number;
        totalRevenue: number;
        paidBills: number;
        paidAmount: number;
        pendingBills: number;
        pendingAmount: number;
      };
    };
  };
  detailedBills: any[];
  monthlyTrend: any[];
}

interface Complaint {
  id: number;
  user_name: string;
  mobile_number: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  complaint_type: string;
  location: string;
  assigned_officer_name: string;
  created_at: string;
  updated_at: string;
  resolved_at: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Revenue data
  revenueStats: RevenueStats | null = null;
  selectedBill: any = null;

  // Complaint data
  complaints: Complaint[] = [];
  complaintStats: any[] = [];
  selectedComplaint: Complaint | null = null;

  // Filters
  statusFilter: string = 'all';
  searchQuery: string = '';

  // View state
  activeTab: 'revenue' | 'complaints' = 'revenue';
  loading = false;

  // Status options for complaints
  statusOptions = [
    { value: 'submitted', label: 'Submitted', color: 'bg-gray-100 text-gray-700' },
    { value: 'under_review', label: 'Under Review', color: 'bg-blue-100 text-blue-700' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'assigned', label: 'Assigned', color: 'bg-purple-100 text-purple-700' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-700' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' }
  ];

  ngOnInit() {
    this.loadRevenueStats();
    this.loadComplaints();
  }

  ngAfterViewInit() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  loadRevenueStats() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/admin/revenue-stats`).subscribe({
      next: (response) => {
        if (response.success) {
          this.revenueStats = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading revenue stats:', error);
        this.loading = false;
      }
    });
  }

  loadComplaints() {
    this.loading = true;
    const params: any = {};
    if (this.statusFilter !== 'all') {
      params.status = this.statusFilter;
    }
    if (this.searchQuery) {
      params.search = this.searchQuery;
    }

    this.http.get<any>(`${environment.apiUrl}/admin/complaints`, { params }).subscribe({
      next: (response) => {
        if (response.success) {
          this.complaints = response.data.complaints;
          this.complaintStats = response.data.statistics;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading complaints:', error);
        this.loading = false;
      }
    });
  }

  updateComplaintStatus(complaint: Complaint, newStatus: string) {
    if (confirm(`Update complaint #${complaint.id} status to "${newStatus}"?`)) {
      this.http.put<any>(`${environment.apiUrl}/admin/complaints/${complaint.id}/status`, {
        status: newStatus
      }).subscribe({
        next: (response) => {
          if (response.success) {
            complaint.status = newStatus;
            alert('Complaint status updated successfully!');
          }
        },
        error: (error) => {
          console.error('Error updating complaint status:', error);
          alert('Failed to update complaint status');
        }
      });
    }
  }

  viewBillDetails(bill: any) {
    this.selectedBill = bill;
  }

  viewComplaintDetails(complaint: Complaint) {
    this.selectedComplaint = complaint;
  }

  closeModal() {
    this.selectedBill = null;
    this.selectedComplaint = null;
  }

  getStatusColor(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'bg-gray-100 text-gray-700';
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  }

  getPriorityColor(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getCategoryIcon(category: string): string {
    switch (category?.toLowerCase()) {
      case 'electricity':
        return 'zap';
      case 'water':
        return 'droplet';
      case 'gas':
        return 'flame';
      case 'municipal':
        return 'building';
      default:
        return 'file-text';
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  exportData() {
    alert('Export functionality coming soon!');
  }
}

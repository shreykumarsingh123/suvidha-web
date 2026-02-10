import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface DashboardStats {
    totalTransactions: number;
    totalRevenue: number;
    activeUsers: number;
    pendingComplaints: number;
    todayTransactions: number;
    successRate: number;
}

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <!-- Header -->
      <header class="bg-white shadow-md border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">SUVIDHA Admin Dashboard</h1>
            <p class="text-sm text-gray-600">Kiosk Management & Monitoring</p>
          </div>
          <button (click)="logout()" class="bg-red-50 hover:bg-red-100 text-red-700 px-6 py-2 rounded-lg font-semibold transition-colors">
            Logout
          </button>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Transactions -->
          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalTransactions }}</p>
                <p class="text-xs text-green-600 mt-2">↑ {{ stats.todayTransactions }} today</p>
              </div>
              <div class="bg-blue-100 p-3 rounded-lg">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Total Revenue -->
          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p class="text-3xl font-bold text-gray-900">₹{{ stats.totalRevenue.toLocaleString() }}</p>
                <p class="text-xs text-green-600 mt-2">Success Rate: {{ stats.successRate }}%</p>
              </div>
              <div class="bg-green-100 p-3 rounded-lg">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Active Users -->
          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Active Users</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.activeUsers }}</p>
                <p class="text-xs text-gray-500 mt-2">Last 24 hours</p>
              </div>
              <div class="bg-purple-100 p-3 rounded-lg">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Pending Complaints -->
          <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Pending Complaints</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.pendingComplaints }}</p>
                <p class="text-xs text-orange-600 mt-2">Requires attention</p>
              </div>
              <div class="bg-orange-100 p-3 rounded-lg">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Tables Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Recent Transactions -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h2>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-gray-200">
                    <th class="text-left py-3 px-2 text-sm font-semibold text-gray-700">ID</th>
                    <th class="text-left py-3 px-2 text-sm font-semibold text-gray-700">Service</th>
                    <th class="text-left py-3 px-2 text-sm font-semibold text-gray-700">Amount</th>
                    <th class="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let txn of recentTransactions" class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="py-3 px-2 text-sm text-gray-600">#{{ txn.id }}</td>
                    <td class="py-3 px-2 text-sm text-gray-900">{{ txn.service }}</td>
                    <td class="py-3 px-2 text-sm font-semibold text-gray-900">₹{{ txn.amount }}</td>
                    <td class="py-3 px-2">
                      <span class="px-2 py-1 text-xs rounded-full" 
                            [ngClass]="{
                              'bg-green-100 text-green-700': txn.status === 'success',
                              'bg-yellow-100 text-yellow-700': txn.status === 'pending',
                              'bg-red-100 text-red-700': txn.status === 'failed'
                            }">
                        {{ txn.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Service Breakdown -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Service Breakdown</h2>
            <div class="space-y-4">
              <div *ngFor="let service of serviceBreakdown">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">{{ service.name }}</span>
                  <span class="text-sm font-bold text-gray-900">{{ service.count }} ({{ service.percentage }}%)</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="h-2 rounded-full transition-all" 
                       [style.width.%]="service.percentage"
                       [ngClass]="{
                         'bg-blue-500': service.name === 'Electricity',
                         'bg-cyan-500': service.name === 'Water',
                         'bg-orange-500': service.name === 'Gas',
                         'bg-purple-500': service.name === 'Municipal'
                       }">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button class="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg font-semibold transition-colors flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Create Alert
            </button>
            <button class="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg font-semibold transition-colors flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Export Report
            </button>
            <button class="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg font-semibold transition-colors flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              Manage Users
            </button>
            <button class="bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-lg font-semibold transition-colors flex items-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class AdminDashboardComponent implements OnInit {
    private http = inject(HttpClient);
    private router = inject(Router);

    stats: DashboardStats = {
        totalTransactions: 1247,
        totalRevenue: 456789,
        activeUsers: 342,
        pendingComplaints: 23,
        todayTransactions: 87,
        successRate: 94.5
    };

    recentTransactions = [
        { id: '1001', service: 'Electricity', amount: 1250, status: 'success' },
        { id: '1002', service: 'Water', amount: 450, status: 'success' },
        { id: '1003', service: 'Gas', amount: 890, status: 'pending' },
        { id: '1004', service: 'Municipal', amount: 200, status: 'success' },
        { id: '1005', service: 'Electricity', amount: 2100, status: 'failed' }
    ];

    serviceBreakdown = [
        { name: 'Electricity', count: 523, percentage: 42 },
        { name: 'Water', count: 312, percentage: 25 },
        { name: 'Gas', count: 249, percentage: 20 },
        { name: 'Municipal', count: 163, percentage: 13 }
    ];

    ngOnInit() {
        // Load real stats from API
        // this.loadStats();
    }

    logout() {
        this.router.navigate(['/login']);
    }
}

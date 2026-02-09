import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillService } from '../../services/bill.service';
import { Bill } from '../../models/bill.model';

@Component({
    selector: 'app-bills-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="bills-container">
      <div class="header">
        <h2>My Bills</h2>
        <div class="filter-tabs">
          <button 
            *ngFor="let type of serviceTypes" 
            [class.active]="selectedType === type"
            (click)="filterByType(type)">
            {{ type | titlecase }}
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">Loading bills...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div class="bills-grid" *ngIf="!loading && !error">
        <div *ngIf="filteredBills.length === 0" class="no-bills">
          <p>No bills found</p>
        </div>

        <div *ngFor="let bill of filteredBills" class="bill-card">
          <div class="bill-header">
            <span class="service-icon">
              {{ getServiceIcon(bill.serviceType) }}
            </span>
            <div>
              <h3>{{ bill.providerName }}</h3>
              <p class="consumer-number">{{ bill.consumerNumber }}</p>
            </div>
            <span class="status" [class]="bill.status">{{ bill.status }}</span>
          </div>
          <div class="bill-details">
            <div class="amount">₹{{ bill.amount }}</div>
            <div class="due-date" *ngIf="bill.dueDate">
              Due: {{ bill.dueDate | date:'dd MMM yyyy' }}
            </div>
          </div>
          <div class="bill-actions">
            <button *ngIf="bill.status === 'unpaid'" class="btn-pay">Pay Now</button>
            <button class="btn-delete" (click)="deleteBill(bill.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .bills-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h2 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #1a1a1a;
    }

    .filter-tabs {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .filter-tabs button {
      padding: 10px 20px;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .filter-tabs button.active {
      background: #4CAF50;
      color: white;
      border-color: #4CAF50;
    }

    .bills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .bill-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .bill-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .bill-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
    }

    .service-icon {
      font-size: 32px;
    }

    .bill-header h3 {
      font-size: 18px;
      margin: 0;
      color: #333;
    }

    .consumer-number {
      font-size: 12px;
      color: #666;
      margin: 4px 0 0 0;
    }

    .status {
      margin-left: auto;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status.paid {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status.unpaid {
      background: #fff3e0;
      color: #e65100;
    }

    .bill-details {
      margin: 15px 0;
    }

    .amount {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
    }

    .due-date {
      font-size: 14px;
      color: #666;
    }

    .bill-actions {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }

    .bill-actions button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-pay {
      background: #4CAF50;
      color: white;
    }

    .btn-pay:hover {
      background: #45a049;
    }

    .btn-delete {
      background: #f5f5f5;
      color: #666;
    }

    .btn-delete:hover {
      background: #ff5252;
      color: white;
    }

    .loading, .error, .no-bills {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .error {
      color: #f44336;
    }
  `]
})
export class BillsListComponent implements OnInit {
    private billService = inject(BillService);

    bills: Bill[] = [];
    filteredBills: Bill[] = [];
    selectedType: string = 'all';
    serviceTypes = ['all', 'electricity', 'water', 'gas'];
    loading = false;
    error: string | null = null;

    ngOnInit() {
        this.loadBills();
    }

    loadBills() {
        this.loading = true;
        this.error = null;

        this.billService.getUserBills().subscribe({
            next: (response) => {
                this.bills = response.bills;
                this.filteredBills = this.bills;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.message || 'Failed to load bills';
                this.loading = false;
            }
        });
    }

    filterByType(type: string) {
        this.selectedType = type;
        if (type === 'all') {
            this.filteredBills = this.bills;
        } else {
            this.filteredBills = this.bills.filter(bill => bill.serviceType === type);
        }
    }

    getServiceIcon(type: string): string {
        const icons: any = {
            'electricity': '⚡',
            'water': '💧',
            'gas': '🔥'
        };
        return icons[type] || '📄';
    }

    deleteBill(id: number) {
        if (confirm('Are you sure you want to delete this bill?')) {
            this.billService.deleteBill(id).subscribe({
                next: () => {
                    this.bills = this.bills.filter(b => b.id !== id);
                    this.filterByType(this.selectedType);
                },
                error: (err) => {
                    alert('Failed to delete bill: ' + err.message);
                }
            });
        }
    }
}

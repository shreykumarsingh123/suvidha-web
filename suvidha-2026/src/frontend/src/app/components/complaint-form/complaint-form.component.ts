import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';
import { AuthService } from '../../core/services/auth.service';
import { ComplaintType, CreateComplaintDto } from '../../models/complaint.model';

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="complaint-form-container">
      <h2>File a Municipal Complaint</h2>

      <form (ngSubmit)="submitComplaint()" #complaintForm="ngForm">
        <div class="form-group">
          <label>Complaint Type *</label>
          <select [(ngModel)]="formData.complaintType" name="complaintType" required>
            <option value="">Select type</option>
            <option *ngFor="let type of complaintTypes" [value]="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Location *</label>
          <input 
            type="text" 
            [(ngModel)]="formData.location" 
            name="location"
            placeholder="Enter location of the issue"
            required>
        </div>

        <div class="form-group">
          <label>Title *</label>
          <input 
            type="text" 
            [(ngModel)]="formData.title" 
            name="title"
            placeholder="Brief description of the issue"
            required>
        </div>

        <div class="form-group">
          <label>Description *</label>
          <textarea 
            [(ngModel)]="formData.description" 
            name="description"
            rows="5"
            placeholder="Provide detailed information about the complaint"
            required></textarea>
        </div>

        <div class="form-group">
          <label>Priority *</label>
          <select [(ngModel)]="formData.priority" name="priority" required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="success" class="success-message">{{ success }}</div>

        <div class="form-actions">
          <button type="submit" [disabled]="!complaintForm.valid || submitting" class="btn-submit">
            {{ submitting ? 'Submitting...' : 'Submit Complaint' }}
          </button>
        </div>
      </form>

      <div class="info-box">
        <h3>ℹ️ What happens next?</h3>
        <ul>
          <li>Your complaint will be registered in the system</li>
          <li>Municipal officers will be notified automatically</li>
          <li>You can track the status in your dashboard</li>
          <li>You'll receive updates as the complaint is processed</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .complaint-form-container {
      max-width: 700px;
      margin: 0 auto;
      padding: 30px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    h2 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 30px;
      color: #1a1a1a;
    }

    .form-group {
      margin-bottom: 24px;
    }

    label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    input, select, textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #4CAF50;
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-actions {
      margin-top: 30px;
    }

    .btn-submit {
      width: 100%;
      padding: 16px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-submit:hover:not(:disabled) {
      background: #45a049;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    }

    .btn-submit:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      padding: 12px;
      background: #ffebee;
      color: #c62828;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .success-message {
      padding: 12px;
      background: #e8f5e9;
      color: #2e7d32;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .info-box {
      margin-top: 30px;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 12px;
    }

    .info-box h3 {
      font-size: 18px;
      margin-bottom: 12px;
      color: #333;
    }

    .info-box ul {
      margin: 0;
      padding-left: 20px;
    }

    .info-box li {
      margin-bottom: 8px;
      color: #666;
      line-height: 1.6;
    }
  `]
})
export class ComplaintFormComponent {
  private complaintService = inject(ComplaintService);
  private authService = inject(AuthService);

  formData: CreateComplaintDto & { location: string } = {
    title: '',
    description: '',
    category: 'municipal',
    priority: 'medium',
    complaintType: undefined,
    location: ''
  };

  complaintTypes = [
    { value: ComplaintType.STREET_LIGHT, label: 'Street Light Issue' },
    { value: ComplaintType.POTHOLE, label: 'Pothole' },
    { value: ComplaintType.SEWER, label: 'Sewer Problem' },
    { value: ComplaintType.GARBAGE, label: 'Garbage Collection' },
    { value: ComplaintType.WATER_SUPPLY, label: 'Water Supply Issue' },
    { value: ComplaintType.ROAD_DAMAGE, label: 'Road Damage' },
    { value: ComplaintType.OTHER, label: 'Other' }
  ];

  submitting = false;
  error: string | null = null;
  success: string | null = null;

  submitComplaint() {
    this.submitting = true;
    this.error = null;
    this.success = null;

    // Get current user ID from auth service
    const currentUser = this.authService.currentUser();
    if (!currentUser?.id) {
      this.error = 'User authentication required. Please log in again.';
      this.submitting = false;
      return;
    }

    // Add userId to the complaint data
    const complaintData = {
      ...this.formData,
      userId: currentUser.id
    };

    this.complaintService.createComplaint(complaintData).subscribe({
      next: (response) => {
        this.success = 'Complaint submitted successfully! Officers have been notified.';
        this.submitting = false;

        // Reset form after 2 seconds
        setTimeout(() => {
          this.resetForm();
          this.success = null;
        }, 2000);
      },
      error: (err) => {
        this.error = err.message || 'Failed to submit complaint. Please try again.';
        this.submitting = false;
      }
    });
  }

  resetForm() {
    this.formData = {
      title: '',
      description: '',
      category: 'municipal',
      priority: 'medium',
      complaintType: undefined,
      location: ''
    };
  }
}

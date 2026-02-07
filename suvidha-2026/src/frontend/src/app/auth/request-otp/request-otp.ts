import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-request-otp',
  templateUrl: './request-otp.html',
  styleUrls: ['./request-otp.css']   
})
export class RequestOtpComponent {
  mobileNumber = '';
  message = '';

  constructor(private apiService: ApiService) {}

  sendOtp() {
    this.apiService.requestOtp(this.mobileNumber).subscribe({
      next: (res) => this.message = res.message,
      error: (err) => this.message = err.message
    });
  }
}

import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.css']
})
export class VerifyOtpComponent {
  mobileNumber = '';
  otp = '';
  message = '';

  constructor(private apiService: ApiService) {}

  verifyOtp() {
    this.apiService.verifyOtp(this.mobileNumber, this.otp).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.message = 'Login successful!';
      },
      error: (err) => this.message = err.message
    });
  }
}

import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  stage: 'mobile' | 'otp' = 'mobile';
  mobile = '';
  otp = '';
  loading = false;
  error = '';
  returnUrl = '/dashboard';
  private maxMobileLen = 10;
  private maxOtpLen = 4;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const q = this.route.snapshot.queryParams['returnUrl'];
    if (q) this.returnUrl = q;
  }

  addKey(d: string) {
    if (this.stage === 'mobile') {
      if (this.mobile.length >= this.maxMobileLen) return;
      this.mobile += d;
    } else {
      if (this.otp.length >= this.maxOtpLen) return;
      this.otp += d;
    }
  }

  delKey() {
    if (this.stage === 'mobile') this.mobile = this.mobile.slice(0, -1);
    else this.otp = this.otp.slice(0, -1);
  }

  clearKey() {
    if (this.stage === 'mobile') this.mobile = '';
    else this.otp = '';
  }

  requestOtp() {
    this.error = '';
    if (this.mobile.length !== this.maxMobileLen) {
      this.error = 'Enter 10-digit mobile number';
      return;
    }
    this.loading = true;
    this.auth.requestOtp(this.mobile).subscribe({
      next: () => {
        this.loading = false;
        this.stage = 'otp';
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to request OTP';
      }
    });
  }

  verifyOtp() {
    this.error = '';
    if (this.otp.length !== this.maxOtpLen) {
      this.error = 'Enter the 4-digit OTP';
      return;
    }
    this.loading = true;
    this.auth.verifyOtp(this.mobile, this.otp).subscribe({
      next: (ok) => {
        this.loading = false;
        if (ok) this.router.navigateByUrl(this.returnUrl);
        else this.error = 'Invalid OTP';
      },
      error: () => {
        this.loading = false;
        this.error = 'Verification failed';
      }
    });
  }

  // allow numeric keyboard on desktop
  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    const k = event.key;
    if (/^[0-9]$/.test(k)) this.addKey(k);
    if (k === 'Backspace') this.delKey();
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOtp } from './request-otp';

describe('RequestOtp', () => {
  let component: RequestOtp;
  let fixture: ComponentFixture<RequestOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestOtp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestOtp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

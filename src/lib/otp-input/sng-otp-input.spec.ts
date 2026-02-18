import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngOtpInput } from './sng-otp-input';
import { SngOtpInputGroup } from './sng-otp-input-group';
import { SngOtpInputSlot } from './sng-otp-input-slot';
import { SngOtpInputSeparator } from './sng-otp-input-separator';

@Component({
  standalone: true,
  imports: [SngOtpInput, SngOtpInputGroup, SngOtpInputSlot, SngOtpInputSeparator],
  template: `
    <sng-otp-input
      [(value)]="otpValue"
      [maxLength]="maxLength"
      [disabled]="disabled"
      [name]="name"
      [class]="customClass"
    >
      <sng-otp-input-group>
        <sng-otp-input-slot [index]="0" />
        <sng-otp-input-slot [index]="1" />
        <sng-otp-input-slot [index]="2" />
      </sng-otp-input-group>
      <sng-otp-input-separator />
      <sng-otp-input-group>
        <sng-otp-input-slot [index]="3" />
        <sng-otp-input-slot [index]="4" />
        <sng-otp-input-slot [index]="5" />
      </sng-otp-input-group>
    </sng-otp-input>
  `,
})
class TestHostComponent {
  otpValue = '';
  maxLength = 6;
  disabled = false;
  name = 'verification-code';
  customClass = '';
}

describe('SngOtpInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let otpInput: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    otpInput = fixture.nativeElement.querySelector('sng-otp-input');
    expect(otpInput).toBeTruthy();
  });

  it('should have correct number of slots', () => {
    fixture.detectChanges();
    const slots = fixture.nativeElement.querySelectorAll('sng-otp-input-slot');
    expect(slots.length).toBe(6);
  });

  it('should have separator', () => {
    fixture.detectChanges();
    const separator = fixture.nativeElement.querySelector('sng-otp-input-separator');
    expect(separator).toBeTruthy();
  });

  it('should have two groups', () => {
    fixture.detectChanges();
    const groups = fixture.nativeElement.querySelectorAll('sng-otp-input-group');
    expect(groups.length).toBe(2);
  });

  it('should have hidden input for value', () => {
    fixture.detectChanges();
    const hiddenInput = fixture.nativeElement.querySelector('input[type="text"]');
    expect(hiddenInput).toBeTruthy();
  });

  it('should apply custom class', () => {
    host.customClass = 'justify-center';
    fixture.detectChanges();
    otpInput = fixture.nativeElement.querySelector('sng-otp-input');
    expect(otpInput.classList.contains('justify-center')).toBeTrue();
  });

  it('should respect maxLength', () => {
    host.maxLength = 4;
    fixture.detectChanges();
    const hiddenInput = fixture.nativeElement.querySelector('input[type="text"]');
    expect(hiddenInput.getAttribute('maxlength')).toBe('4');
  });

  it('should apply name attribute to hidden input', () => {
    fixture.detectChanges();
    const hiddenInput = fixture.nativeElement.querySelector('input[type="text"]');
    expect(hiddenInput.getAttribute('name')).toBe('verification-code');
  });

  it('should display initial value in slots', () => {
    host.otpValue = '123456';
    fixture.detectChanges();

    const slots = fixture.nativeElement.querySelectorAll('sng-otp-input-slot');
    expect(slots[0].textContent.trim()).toContain('1');
    expect(slots[1].textContent.trim()).toContain('2');
    expect(slots[2].textContent.trim()).toContain('3');
    expect(slots[3].textContent.trim()).toContain('4');
    expect(slots[4].textContent.trim()).toContain('5');
    expect(slots[5].textContent.trim()).toContain('6');
  });
});

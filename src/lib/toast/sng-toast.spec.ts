import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngToast } from './sng-toast';
import type { Toast } from './sng-toast.service';

@Component({
  standalone: true,
  imports: [SngToast],
  template: `<sng-toast [toast]="toast" (dismissed)="dismissedCount = dismissedCount + 1" />`,
})
class TestHostComponent {
  dismissedCount = 0;
  toast: Toast = {
    id: 'toast-1',
    title: 'Saved',
  };
}

describe('SngToast', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render dismiss button with accessible label', () => {
    const closeButton = fixture.nativeElement.querySelector('button[aria-label="Dismiss notification"]');
    expect(closeButton).toBeTruthy();
  });

  it('should emit dismissed when close button is clicked', () => {
    const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[aria-label="Dismiss notification"]');
    closeButton.click();
    fixture.detectChanges();

    expect(host.dismissedCount).toBe(1);
  });
});

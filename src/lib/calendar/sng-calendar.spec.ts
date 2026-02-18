import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngCalendar } from './sng-calendar';

@Component({
  standalone: true,
  imports: [SngCalendar],
  template: `
    <sng-calendar
      [selected]="selectedDate"
      (dateSelected)="onDateSelected($event)"
    />
  `,
})
class TestHostComponent {
  selectedDate: Date | null = null;
  onDateSelected(date: Date) {
    this.selectedDate = date;
  }
}

describe('SngCalendar', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let calendar: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    calendar = fixture.nativeElement.querySelector('sng-calendar');
  });

  it('should create', () => {
    expect(calendar).toBeTruthy();
  });

  it('should render weekday headers', () => {
    const weekdays = fixture.nativeElement.querySelectorAll('.text-muted-foreground');
    expect(weekdays.length).toBeGreaterThan(0);
  });

  it('should render day buttons', () => {
    const days = fixture.nativeElement.querySelectorAll('button[type="button"]');
    expect(days.length).toBeGreaterThan(0);
  });

  it('should navigate to previous month', () => {
    const prevButton = fixture.nativeElement.querySelector('button');
    expect(prevButton).toBeTruthy();
  });

  it('should have month selects', () => {
    const selects = fixture.nativeElement.querySelectorAll('select');
    expect(selects.length).toBeGreaterThan(0);
  });

  it('should update visible month when selected input changes', () => {
    const calendarFixture = TestBed.createComponent(SngCalendar);
    calendarFixture.componentRef.setInput('selected', null);
    calendarFixture.detectChanges();

    calendarFixture.componentRef.setInput('selected', new Date(2030, 4, 15));
    calendarFixture.detectChanges();

    const monthSelect = calendarFixture.nativeElement.querySelector('select[aria-label="Select month"]') as HTMLSelectElement;
    const yearSelect = calendarFixture.nativeElement.querySelector('select[aria-label="Select year"]') as HTMLSelectElement;

    expect(monthSelect.value).toBe('4');
    expect(yearSelect.value).toBe('2030');
  });

  it('should update visible month when selectedRange input changes', () => {
    const calendarFixture = TestBed.createComponent(SngCalendar);
    calendarFixture.componentRef.setInput('mode', 'range');
    calendarFixture.componentRef.setInput('selectedRange', null);
    calendarFixture.detectChanges();

    calendarFixture.componentRef.setInput('selectedRange', {
      from: new Date(2031, 7, 10),
      to: new Date(2031, 7, 20),
    });
    calendarFixture.detectChanges();

    const monthSelect = calendarFixture.nativeElement.querySelector('select[aria-label="Select month"]') as HTMLSelectElement;
    const yearSelect = calendarFixture.nativeElement.querySelector('select[aria-label="Select year"]') as HTMLSelectElement;

    expect(monthSelect.value).toBe('7');
    expect(yearSelect.value).toBe('2031');
  });
});

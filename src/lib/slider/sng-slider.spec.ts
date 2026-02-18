import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngSlider } from './sng-slider';

@Component({
  standalone: true,
  imports: [SngSlider],
  template: `<sng-slider
    [min]="min"
    [max]="max"
    [step]="step"
    [value]="value"
    [disabled]="disabled"
    [orientation]="orientation"
    [class]="customClass"
    (valueChange)="onValueChange($event)"
  />`,
})
class TestHostComponent {
  min = 0;
  max = 100;
  step = 1;
  value = 50;
  disabled = false;
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  customClass = '';
  newValue = 0;
  onValueChange(value: number) {
    this.newValue = value;
  }
}

describe('SngSlider', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let slider: HTMLElement;
  let input: HTMLInputElement;

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
    slider = fixture.nativeElement.querySelector('sng-slider');
    input = slider.querySelector('input[type="range"]') as HTMLInputElement;
    expect(slider).toBeTruthy();
    expect(input).toBeTruthy();
  });

  it('should have correct attributes', () => {
    fixture.detectChanges();
    slider = fixture.nativeElement.querySelector('sng-slider');
    input = slider.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
    expect(input.step).toBe('1');
    expect(input.value).toBe('50');
  });

  it('should emit value on input', () => {
    fixture.detectChanges();
    slider = fixture.nativeElement.querySelector('sng-slider');
    input = slider.querySelector('input[type="range"]') as HTMLInputElement;
    input.value = '75';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.newValue).toBe(75);
  });

  it('should be disabled when set', () => {
    host.disabled = true;
    fixture.detectChanges();
    slider = fixture.nativeElement.querySelector('sng-slider');
    input = slider.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.disabled).toBeTrue();
  });

  it('should apply custom class', () => {
    host.customClass = 'max-w-xs h-2.5 [--thumb-size:1.5rem]';
    fixture.detectChanges();
    slider = fixture.nativeElement.querySelector('sng-slider');
    input = slider.querySelector('input[type="range"]') as HTMLInputElement;
    expect(slider.classList.contains('max-w-xs')).toBeFalse();
    expect(slider.classList.contains('h-2.5')).toBeFalse();
    expect(slider.className.includes('--thumb-size')).toBeFalse();
    expect(input.className.includes('max-w-xs')).toBeTrue();
    expect(input.className.includes('h-2.5')).toBeTrue();
    expect(input.className.includes('[--thumb-size:1.5rem]')).toBeTrue();
  });

  it('should apply default horizontal sizing classes on input', () => {
    fixture.detectChanges();
    slider = fixture.nativeElement.querySelector('sng-slider');
    input = slider.querySelector('input[type="range"]') as HTMLInputElement;
    expect(slider.classList.contains('w-full')).toBeTrue();
    expect(input.classList.contains('w-full')).toBeTrue();
    expect(input.classList.contains('h-1.5')).toBeTrue();
  });

  it('should apply default vertical sizing classes on input', () => {
    host.orientation = 'vertical';
    fixture.detectChanges();
    slider = fixture.nativeElement.querySelector('sng-slider');
    input = slider.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.classList.contains('block')).toBeTrue();
    expect(input.classList.contains('h-full')).toBeTrue();
    expect(input.classList.contains('w-1.5')).toBeTrue();
  });

  it('should support vertical orientation', () => {
    host.orientation = 'vertical';
    fixture.detectChanges();
    slider = fixture.nativeElement.querySelector('sng-slider');
    expect(slider.classList.contains('vertical')).toBeTrue();
  });

  it('should expose vertical aria orientation when vertical', () => {
    host.orientation = 'vertical';
    fixture.detectChanges();
    slider = fixture.nativeElement.querySelector('sng-slider');
    input = slider.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.getAttribute('aria-orientation')).toBe('vertical');
  });
});

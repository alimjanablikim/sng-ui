import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngToggleGroup } from './sng-toggle-group';
import { SngToggleGroupItem } from './sng-toggle-group-item';

@Component({
  standalone: true,
  imports: [SngToggleGroup, SngToggleGroupItem],
  template: `
    <sng-toggle-group type="single" defaultValue="center">
      <sng-toggle-group-item value="left" aria-label="Align left">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18" /></svg>
      </sng-toggle-group-item>
      <sng-toggle-group-item value="center" aria-label="Align center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" /></svg>
      </sng-toggle-group-item>
      <sng-toggle-group-item value="right" aria-label="Align right">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 18h18" /></svg>
      </sng-toggle-group-item>
    </sng-toggle-group>
  `,
})
class ToggleGroupItemHostComponent {}

describe('SngToggleGroupItem', () => {
  let fixture: ComponentFixture<ToggleGroupItemHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleGroupItemHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleGroupItemHostComponent);
    fixture.detectChanges();
  });

  it('should not include selector-hack classes in host class string', () => {
    const firstItem: HTMLElement = fixture.nativeElement.querySelector('sng-toggle-group-item');
    expect(firstItem.className).not.toContain('[&');
  });

  it('should use outline styles by default for group items', () => {
    const firstItem: HTMLElement = fixture.nativeElement.querySelector('sng-toggle-group-item[aria-label="Align left"]');
    expect(firstItem.classList.contains('border')).toBeTrue();
    expect(firstItem.classList.contains('border-input')).toBeTrue();
    expect(firstItem.classList.contains('bg-background')).toBeTrue();
    expect(firstItem.classList.contains('shadow-sm')).toBeTrue();
  });

  it('should update single selection when a different item is clicked', () => {
    const left: HTMLElement = fixture.nativeElement.querySelector('sng-toggle-group-item[aria-label="Align left"]');
    const center: HTMLElement = fixture.nativeElement.querySelector('sng-toggle-group-item[aria-label="Align center"]');
    const right: HTMLElement = fixture.nativeElement.querySelector('sng-toggle-group-item[aria-label="Align right"]');

    expect(center.getAttribute('aria-pressed')).toBe('true');
    expect(center.className).toContain('data-[state=on]:bg-primary');
    expect(center.className).toContain('data-[state=on]:text-primary-foreground');
    expect(center.className).toContain('data-[state=on]:border-primary');
    expect(center.className).toContain('data-[state=on]:hover:bg-primary');
    expect(right.getAttribute('aria-pressed')).toBe('false');

    right.click();
    fixture.detectChanges();

    expect(center.getAttribute('aria-pressed')).toBe('false');
    expect(right.getAttribute('aria-pressed')).toBe('true');
    expect(right.className).toContain('data-[state=on]:bg-primary');
    expect(right.className).toContain('data-[state=on]:text-primary-foreground');
    expect(right.className).toContain('data-[state=on]:border-primary');
    expect(left.getAttribute('aria-pressed')).toBe('false');
  });
});

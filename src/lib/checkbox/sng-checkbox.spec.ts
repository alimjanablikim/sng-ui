import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngCheckbox } from './sng-checkbox';

@Component({
  standalone: true,
  imports: [SngCheckbox],
  template: `
    <sng-checkbox
      id="terms"
      [class]="checkboxClass"
      [(checked)]="checked"
      [disabled]="disabled"
      [indeterminate]="indeterminate"
    />
    <label for="terms" class="terms-label">Accept terms</label>
  `,
})
class TestHostComponent {
  checkboxClass = '';
  checked = false;
  disabled = false;
  indeterminate = false;
}

describe('SngCheckbox', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let checkbox: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  describe('Basic functionality', () => {
    it('should create', () => {
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');
      expect(checkbox).toBeTruthy();
    });

    it('should have role="checkbox"', () => {
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');
      expect(checkbox.getAttribute('role')).toBe('checkbox');
    });

    it('should be unchecked by default', () => {
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');
      expect(checkbox.getAttribute('aria-checked')).toBe('false');
      expect(checkbox.getAttribute('data-state')).toBe('unchecked');
    });
  });

  describe('Checked state', () => {
    it('should toggle when clicked', () => {
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');
      checkbox.click();
      fixture.detectChanges();

      expect(host.checked).toBeTrue();
      expect(checkbox.getAttribute('aria-checked')).toBe('true');
      expect(checkbox.getAttribute('data-state')).toBe('checked');
    });

    it('should show checkmark when checked', () => {
      host.checked = true;
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      const svg = checkbox.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should toggle off when clicked again', () => {
      host.checked = true;
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      checkbox.click();
      fixture.detectChanges();

      expect(host.checked).toBeFalse();
    });
  });

  describe('Indeterminate state', () => {
    it('should show indeterminate state', () => {
      host.indeterminate = true;
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
      expect(checkbox.getAttribute('data-state')).toBe('indeterminate');
    });

    it('should show line icon when indeterminate', () => {
      host.indeterminate = true;
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      const svg = checkbox.querySelector('svg');
      const line = svg?.querySelector('line');
      expect(line).toBeTruthy();
    });
  });

  describe('Disabled state', () => {
    it('should set aria-disabled when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      expect(checkbox.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have tabindex=-1 when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      expect(checkbox.getAttribute('tabindex')).toBe('-1');
    });

    it('should not toggle when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      checkbox.click();
      fixture.detectChanges();

      expect(host.checked).toBeFalse();
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');
      expect(checkbox.getAttribute('tabindex')).toBe('0');
    });

    it('should toggle when associated label is clicked', () => {
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label[for="terms"]') as HTMLLabelElement;
      label.click();
      fixture.detectChanges();

      expect(host.checked).toBeTrue();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');
      expect(checkbox.getAttribute('data-state')).toBe('checked');
    });

    it('should not toggle from associated label click when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label[for="terms"]') as HTMLLabelElement;
      label.click();
      fixture.detectChanges();

      expect(host.checked).toBeFalse();
    });
  });

  describe('Class input', () => {
    it('should apply custom classes', () => {
      host.checkboxClass = 'size-5';
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      expect(checkbox.classList.contains('size-5')).toBeTrue();
    });
  });

  describe('Two-way binding', () => {
    it('should support [(checked)] binding', () => {
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      expect(host.checked).toBeFalse();

      checkbox.click();
      fixture.detectChanges();

      expect(host.checked).toBeTrue();
    });

    it('should reflect external checked changes', () => {
      host.checked = true;
      fixture.detectChanges();
      checkbox = fixture.nativeElement.querySelector('sng-checkbox');

      expect(checkbox.getAttribute('data-state')).toBe('checked');
      expect(checkbox.getAttribute('aria-checked')).toBe('true');
    });
  });
});

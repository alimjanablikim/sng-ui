import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngSwitch } from './sng-switch';

@Component({
  standalone: true,
  imports: [SngSwitch],
  template: `
    <div [attr.dir]="dir">
      <sng-switch
        [class]="switchClass"
        [(checked)]="checked"
        [disabled]="disabled"
        [ariaLabel]="ariaLabel"
        [ariaLabelledby]="ariaLabelledby"
      />
    </div>
  `,
})
class TestHostComponent {
  switchClass = '';
  checked = false;
  disabled = false;
  ariaLabel = '';
  ariaLabelledby = '';
  dir: 'ltr' | 'rtl' | null = null;
}

describe('SngSwitch', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let switchEl: HTMLElement;

  beforeEach(async () => {
    document.documentElement.setAttribute('dir', 'ltr');

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
      switchEl = fixture.nativeElement.querySelector('sng-switch');
      expect(switchEl).toBeTruthy();
    });

    it('should have role="switch"', () => {
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');
      expect(switchEl.getAttribute('role')).toBe('switch');
    });

    it('should be unchecked by default', () => {
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');
      expect(switchEl.getAttribute('aria-checked')).toBe('false');
      expect(switchEl.getAttribute('data-state')).toBe('unchecked');
    });

    it('should have a thumb element', () => {
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');
      const thumb = switchEl.querySelector('span');
      expect(thumb).toBeTruthy();
    });
  });

  describe('Checked state', () => {
    it('should toggle when clicked', () => {
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');
      switchEl.click();
      fixture.detectChanges();

      expect(host.checked).toBeTrue();
      expect(switchEl.getAttribute('aria-checked')).toBe('true');
      expect(switchEl.getAttribute('data-state')).toBe('checked');
    });

    it('should use checked thumb translation class', () => {
      host.checked = true;
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      const thumb = switchEl.querySelector('span');
      expect(thumb?.classList.contains('translate-x-full')).toBeTrue();
      expect(thumb?.classList.contains('translate-x-0')).toBeFalse();
    });

    it('should use unchecked thumb translation class by default', () => {
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');
      const thumb = switchEl.querySelector('span');
      expect(thumb?.classList.contains('translate-x-0')).toBeTrue();
      expect(thumb?.classList.contains('translate-x-full')).toBeFalse();
    });

    it('should size thumb from track height minus border', () => {
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      const thumb = switchEl.querySelector('span');
      expect(thumb?.classList.contains('h-full')).toBeTrue();
      expect(thumb?.classList.contains('aspect-square')).toBeTrue();
      expect(thumb?.classList.contains('size-4')).toBeFalse();
    });

    it('should toggle off when clicked again', () => {
      host.checked = true;
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      switchEl.click();
      fixture.detectChanges();

      expect(host.checked).toBeFalse();
    });

    it('should keep unchecked thumb at rtl start position', () => {
      document.documentElement.setAttribute('dir', 'rtl');
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      const thumb = switchEl.querySelector('span');
      expect(thumb?.classList.contains('translate-x-0')).toBeTrue();
      expect(thumb?.classList.contains('-translate-x-full')).toBeFalse();
    });

    it('should place checked thumb on the left in rtl', () => {
      document.documentElement.setAttribute('dir', 'rtl');
      host.checked = true;
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      const thumb = switchEl.querySelector('span');
      expect(thumb?.classList.contains('-translate-x-full')).toBeTrue();
      expect(thumb?.classList.contains('translate-x-0')).toBeFalse();
    });

    it('should prefer nearest dir container for rtl positioning', () => {
      document.documentElement.setAttribute('dir', 'ltr');
      host.dir = 'rtl';
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      const thumb = switchEl.querySelector('span');
      expect(thumb?.classList.contains('translate-x-0')).toBeTrue();
      expect(thumb?.classList.contains('-translate-x-full')).toBeFalse();
    });
  });

  describe('Disabled state', () => {
    it('should set aria-disabled when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      expect(switchEl.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have tabindex=-1 when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      expect(switchEl.getAttribute('tabindex')).toBe('-1');
    });

    it('should not toggle when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      switchEl.click();
      fixture.detectChanges();

      expect(host.checked).toBeFalse();
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');
      expect(switchEl.getAttribute('tabindex')).toBe('0');
    });

    it('should set aria-label when provided', () => {
      host.ariaLabel = 'Airplane mode';
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');
      expect(switchEl.getAttribute('aria-label')).toBe('Airplane mode');
    });

    it('should set aria-labelledby when provided', () => {
      host.ariaLabelledby = 'switch-label-id';
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');
      expect(switchEl.getAttribute('aria-labelledby')).toBe('switch-label-id');
    });
  });

  describe('Class input', () => {
    it('should apply custom classes', () => {
      host.switchClass = 'w-10';
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      expect(switchEl.classList.contains('w-10')).toBeTrue();
    });
  });

  describe('Two-way binding', () => {
    it('should support [(checked)] binding', () => {
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      expect(host.checked).toBeFalse();

      switchEl.click();
      fixture.detectChanges();

      expect(host.checked).toBeTrue();
    });

    it('should reflect external checked changes', () => {
      host.checked = true;
      fixture.detectChanges();
      switchEl = fixture.nativeElement.querySelector('sng-switch');

      expect(switchEl.getAttribute('data-state')).toBe('checked');
      expect(switchEl.getAttribute('aria-checked')).toBe('true');
    });
  });
});

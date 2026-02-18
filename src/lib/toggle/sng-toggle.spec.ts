import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngToggle } from './sng-toggle';

@Component({
  standalone: true,
  imports: [SngToggle],
  template: `
    <sng-toggle
      [class]="toggleClass"
      [(pressed)]="pressed"
      [disabled]="disabled"
    >
      Bold
    </sng-toggle>
  `,
})
class TestHostComponent {
  toggleClass = '';
  pressed = false;
  disabled = false;
}

describe('SngToggle', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let toggle: HTMLElement;

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
      toggle = fixture.nativeElement.querySelector('sng-toggle');
      expect(toggle).toBeTruthy();
    });

    it('should have role="button"', () => {
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');
      expect(toggle.getAttribute('role')).toBe('button');
    });

    it('should render content', () => {
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');
      expect(toggle.textContent?.trim()).toBe('Bold');
    });

    it('should be off by default', () => {
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');
      expect(toggle.getAttribute('aria-pressed')).toBe('false');
      expect(toggle.getAttribute('data-state')).toBe('off');
    });

    it('should use outline styles by default', () => {
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');
      expect(toggle.classList.contains('border')).toBeTrue();
      expect(toggle.classList.contains('border-input')).toBeTrue();
      expect(toggle.classList.contains('shadow-sm')).toBeTrue();
    });
  });

  describe('Pressed state', () => {
    it('should toggle when clicked', () => {
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');
      toggle.click();
      fixture.detectChanges();

      expect(host.pressed).toBeTrue();
      expect(toggle.getAttribute('aria-pressed')).toBe('true');
      expect(toggle.getAttribute('data-state')).toBe('on');
    });

    it('should include state-driven selected classes', () => {
      host.pressed = true;
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      expect(toggle.getAttribute('data-state')).toBe('on');
      expect(toggle.className).toContain('data-[state=on]:bg-primary');
      expect(toggle.className).toContain('data-[state=on]:text-primary-foreground');
      expect(toggle.className).toContain('data-[state=on]:border-primary');
      expect(toggle.className).toContain('data-[state=on]:hover:bg-primary');
    });

    it('should toggle off when clicked again', () => {
      host.pressed = true;
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      toggle.click();
      fixture.detectChanges();

      expect(host.pressed).toBeFalse();
    });
  });

  describe('Disabled state', () => {
    it('should set aria-disabled attribute when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      expect(toggle.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have tabindex=-1 when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      expect(toggle.getAttribute('tabindex')).toBe('-1');
    });

    it('should not toggle when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      toggle.click();
      fixture.detectChanges();

      expect(host.pressed).toBeFalse();
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');
      expect(toggle.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Class input', () => {
    it('should apply custom classes', () => {
      host.toggleClass = 'h-12 px-4';
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      expect(toggle.classList.contains('h-12')).toBeTrue();
      expect(toggle.classList.contains('px-4')).toBeTrue();
    });

    it('should allow ghost-style override via class input', () => {
      host.toggleClass = 'data-[state=off]:border-transparent data-[state=off]:shadow-none data-[state=off]:bg-transparent data-[state=off]:hover:bg-muted data-[state=off]:hover:text-muted-foreground';
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      expect(toggle.className).toContain('data-[state=off]:border-transparent');
      expect(toggle.className).toContain('data-[state=off]:shadow-none');
      expect(toggle.className).toContain('data-[state=off]:bg-transparent');
    });

    it('should not include selector-hack classes in host class string', () => {
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      expect(toggle.className).not.toContain('[&');
    });
  });

  describe('Two-way binding', () => {
    it('should support [(pressed)] binding', () => {
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      expect(host.pressed).toBeFalse();

      toggle.click();
      fixture.detectChanges();

      expect(host.pressed).toBeTrue();
    });

    it('should reflect external pressed changes', () => {
      host.pressed = true;
      fixture.detectChanges();
      toggle = fixture.nativeElement.querySelector('sng-toggle');

      expect(toggle.getAttribute('data-state')).toBe('on');
      expect(toggle.getAttribute('aria-pressed')).toBe('true');
    });
  });
});

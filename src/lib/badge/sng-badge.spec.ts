import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngBadge } from './sng-badge';

describe('SngBadge', () => {
  describe('Basic functionality', () => {
    @Component({
      standalone: true,
      imports: [SngBadge],
      template: `<sng-badge>Badge</sng-badge>`,
    })
    class BasicTestComponent {}

    let fixture: ComponentFixture<BasicTestComponent>;
    let badge: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      badge = fixture.nativeElement.querySelector('sng-badge');
    });

    it('should create', () => {
      expect(badge).toBeTruthy();
    });

    it('should render content', () => {
      expect(badge.textContent?.trim()).toBe('Badge');
    });

    it('should apply base classes', () => {
      expect(badge.classList.contains('inline-flex')).toBeTrue();
      expect(badge.classList.contains('items-center')).toBeTrue();
      expect(badge.classList.contains('rounded-full')).toBeTrue();
    });
  });

  describe('Styling', () => {
    @Component({
      standalone: true,
      imports: [SngBadge],
      template: `<sng-badge>Badge</sng-badge>`,
    })
    class StyleTestComponent {}

    let fixture: ComponentFixture<StyleTestComponent>;
    let badge: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StyleTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(StyleTestComponent);
      fixture.detectChanges();
      badge = fixture.nativeElement.querySelector('sng-badge');
    });

    it('should have primary colors by default', () => {
      expect(badge.classList.contains('bg-primary')).toBeTrue();
      expect(badge.classList.contains('text-primary-foreground')).toBeTrue();
    });

    it('should have border-transparent', () => {
      expect(badge.classList.contains('border-transparent')).toBeTrue();
    });

    it('should have text size', () => {
      expect(badge.classList.contains('text-xs')).toBeTrue();
      expect(badge.classList.contains('font-medium')).toBeTrue();
    });

    it('should use compact default padding', () => {
      expect(badge.classList.contains('px-2')).toBeTrue();
      expect(badge.classList.contains('py-0.5')).toBeTrue();
    });
  });

  describe('Custom classes - secondary', () => {
    @Component({
      standalone: true,
      imports: [SngBadge],
      template: `<sng-badge class="bg-secondary text-secondary-foreground">Badge</sng-badge>`,
    })
    class SecondaryTestComponent {}

    it('should apply secondary variant classes', async () => {
      await TestBed.configureTestingModule({
        imports: [SecondaryTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(SecondaryTestComponent);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('sng-badge');
      expect(badge.classList.contains('bg-secondary')).toBeTrue();
      expect(badge.classList.contains('text-secondary-foreground')).toBeTrue();
    });
  });

  describe('Custom classes - destructive', () => {
    @Component({
      standalone: true,
      imports: [SngBadge],
      template: `<sng-badge class="bg-destructive text-destructive-foreground">Badge</sng-badge>`,
    })
    class DestructiveTestComponent {}

    it('should apply destructive variant classes', async () => {
      await TestBed.configureTestingModule({
        imports: [DestructiveTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(DestructiveTestComponent);
      fixture.detectChanges();

      const badge = fixture.nativeElement.querySelector('sng-badge');
      expect(badge.classList.contains('bg-destructive')).toBeTrue();
    });
  });

  describe('Element selector', () => {
    @Component({
      standalone: true,
      imports: [SngBadge],
      template: `<sng-badge>Element Badge</sng-badge>`,
    })
    class ElementTestComponent {}

    it('should work with element selector', async () => {
      await TestBed.configureTestingModule({
        imports: [ElementTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(ElementTestComponent);
      fixture.detectChanges();

      const elementBadge = fixture.nativeElement.querySelector('sng-badge');
      expect(elementBadge).toBeTruthy();
      expect(elementBadge.classList.contains('inline-flex')).toBeTrue();
    });
  });
});

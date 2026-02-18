import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngSeparator } from './sng-separator';

describe('SngSeparator', () => {
  describe('Basic functionality', () => {
    @Component({
      standalone: true,
      imports: [SngSeparator],
      template: `<sng-separator />`,
    })
    class BasicTestComponent {}

    let fixture: ComponentFixture<BasicTestComponent>;
    let separator: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      separator = fixture.nativeElement.querySelector('sng-separator');
    });

    it('should create', () => {
      expect(separator).toBeTruthy();
    });

    it('should have role="separator"', () => {
      expect(separator.getAttribute('role')).toBe('separator');
    });

    it('should have bg-border class', () => {
      expect(separator.classList.contains('bg-border')).toBeTrue();
    });
  });

  describe('Horizontal orientation (default)', () => {
    @Component({
      standalone: true,
      imports: [SngSeparator],
      template: `<sng-separator orientation="horizontal" />`,
    })
    class HorizontalTestComponent {}

    let fixture: ComponentFixture<HorizontalTestComponent>;
    let separator: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HorizontalTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(HorizontalTestComponent);
      fixture.detectChanges();
      separator = fixture.nativeElement.querySelector('sng-separator');
    });

    it('should be horizontal by default', () => {
      expect(separator.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('should have horizontal dimension classes', () => {
      expect(separator.classList.contains('w-full')).toBeTrue();
      expect(separator.classList.contains('h-px')).toBeTrue();
    });
  });

  describe('Vertical orientation', () => {
    @Component({
      standalone: true,
      imports: [SngSeparator],
      template: `<sng-separator orientation="vertical" />`,
    })
    class VerticalTestComponent {}

    let fixture: ComponentFixture<VerticalTestComponent>;
    let separator: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [VerticalTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(VerticalTestComponent);
      fixture.detectChanges();
      separator = fixture.nativeElement.querySelector('sng-separator');
    });

    it('should have aria-orientation="vertical"', () => {
      expect(separator.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should have vertical dimension classes', () => {
      expect(separator.classList.contains('h-full')).toBeTrue();
      expect(separator.classList.contains('w-px')).toBeTrue();
    });
  });

  describe('Custom classes', () => {
    @Component({
      standalone: true,
      imports: [SngSeparator],
      template: `<sng-separator class="my-4" />`,
    })
    class CustomClassTestComponent {}

    it('should apply custom classes', async () => {
      await TestBed.configureTestingModule({
        imports: [CustomClassTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(CustomClassTestComponent);
      fixture.detectChanges();

      const separator = fixture.nativeElement.querySelector('sng-separator');
      expect(separator.classList.contains('my-4')).toBeTrue();
    });
  });

  describe('Element selector', () => {
    @Component({
      standalone: true,
      imports: [SngSeparator],
      template: `<sng-separator />`,
    })
    class ElementTestComponent {}

    it('should work with element selector', async () => {
      await TestBed.configureTestingModule({
        imports: [ElementTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(ElementTestComponent);
      fixture.detectChanges();

      const separator = fixture.nativeElement.querySelector('sng-separator');
      expect(separator).toBeTruthy();
      expect(separator.getAttribute('role')).toBe('separator');
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngProgress } from './sng-progress';

describe('SngProgress', () => {
  describe('Basic functionality', () => {
    @Component({
      standalone: true,
      imports: [SngProgress],
      template: `<sng-progress [value]="33" />`,
    })
    class BasicTestComponent {}

    let fixture: ComponentFixture<BasicTestComponent>;
    let progress: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      progress = fixture.nativeElement.querySelector('sng-progress');
    });

    it('should create', () => {
      expect(progress).toBeTruthy();
    });

    it('should have role="progressbar"', () => {
      expect(progress.getAttribute('role')).toBe('progressbar');
    });

    it('should render progress indicator', () => {
      const indicator = progress.querySelector('div');
      expect(indicator).toBeTruthy();
    });
  });

  describe('ARIA attributes', () => {
    @Component({
      standalone: true,
      imports: [SngProgress],
      template: `<sng-progress [value]="33" />`,
    })
    class AriaTestComponent {}

    let fixture: ComponentFixture<AriaTestComponent>;
    let progress: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [AriaTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(AriaTestComponent);
      fixture.detectChanges();
      progress = fixture.nativeElement.querySelector('sng-progress');
    });

    it('should have aria-valuemin="0"', () => {
      expect(progress.getAttribute('aria-valuemin')).toBe('0');
    });

    it('should have aria-valuemax="100"', () => {
      expect(progress.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should have aria-valuenow reflecting value', () => {
      expect(progress.getAttribute('aria-valuenow')).toBe('33');
    });
  });

  describe('Progress at 50%', () => {
    @Component({
      standalone: true,
      imports: [SngProgress],
      template: `<sng-progress [value]="50" />`,
    })
    class Progress50TestComponent {}

    it('should have transform for 50% value', async () => {
      await TestBed.configureTestingModule({
        imports: [Progress50TestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(Progress50TestComponent);
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('sng-progress');
      const indicator = progress.querySelector('div') as HTMLElement;
      expect(indicator.style.transform).toContain('-50%');
    });
  });

  describe('Progress at 100%', () => {
    @Component({
      standalone: true,
      imports: [SngProgress],
      template: `<sng-progress [value]="100" />`,
    })
    class Progress100TestComponent {}

    it('should be at 0% when value is 100', async () => {
      await TestBed.configureTestingModule({
        imports: [Progress100TestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(Progress100TestComponent);
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('sng-progress');
      const indicator = progress.querySelector('div') as HTMLElement;
      // When value is 100%, translateX is 0% (no negative offset means fully visible)
      expect(indicator.style.transform).toBe('translateX(0%)');
    });
  });

  describe('Orientation', () => {
    @Component({
      standalone: true,
      imports: [SngProgress],
      template: `<sng-progress [value]="50" orientation="vertical" class="h-48" />`,
    })
    class VerticalTestComponent {}

    it('should default to horizontal orientation', async () => {
      @Component({
        standalone: true,
        imports: [SngProgress],
        template: `<sng-progress [value]="50" />`,
      })
      class HorizontalTestComponent {}

      await TestBed.configureTestingModule({
        imports: [HorizontalTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(HorizontalTestComponent);
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('sng-progress');
      expect(progress.getAttribute('aria-orientation')).toBe('horizontal');
      expect(progress.classList.contains('w-full')).toBeTrue();
      expect(progress.classList.contains('h-2')).toBeTrue();
    });

    it('should apply vertical classes', async () => {
      await TestBed.configureTestingModule({
        imports: [VerticalTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(VerticalTestComponent);
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('sng-progress');
      expect(progress.classList.contains('w-2')).toBeTrue();
      expect(progress.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should use translateY for vertical orientation', async () => {
      await TestBed.configureTestingModule({
        imports: [VerticalTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(VerticalTestComponent);
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('sng-progress');
      const indicator = progress.querySelector('div') as HTMLElement;
      expect(indicator.style.transform).toBe('translateY(50%)');
    });
  });

  describe('Styling', () => {
    @Component({
      standalone: true,
      imports: [SngProgress],
      template: `<sng-progress [value]="33" />`,
    })
    class StyleTestComponent {}

    let fixture: ComponentFixture<StyleTestComponent>;
    let progress: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StyleTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(StyleTestComponent);
      fixture.detectChanges();
      progress = fixture.nativeElement.querySelector('sng-progress');
    });

    it('should have rounded-full class', () => {
      expect(progress.classList.contains('rounded-full')).toBeTrue();
    });

    it('should have overflow-hidden class', () => {
      expect(progress.classList.contains('overflow-hidden')).toBeTrue();
    });

    it('should have height class', () => {
      expect(progress.classList.contains('h-2')).toBeTrue();
    });

    it('should have block display class', () => {
      expect(progress.classList.contains('block')).toBeTrue();
    });

    it('should have currentColor-based indicator classes', () => {
      const indicator = progress.querySelector('div') as HTMLElement;
      expect(indicator.classList.contains('bg-current')).toBeTrue();
      expect(progress.classList.contains('text-primary')).toBeTrue();
    });
  });

  describe('Custom classes', () => {
    @Component({
      standalone: true,
      imports: [SngProgress],
      template: `<sng-progress [value]="33" class="h-4 w-60" />`,
    })
    class CustomClassTestComponent {}

    it('should apply custom classes', async () => {
      await TestBed.configureTestingModule({
        imports: [CustomClassTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(CustomClassTestComponent);
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('sng-progress');
      expect(progress.classList.contains('h-4')).toBeTrue();
      expect(progress.classList.contains('w-60')).toBeTrue();
    });
  });

  describe('Value bounds', () => {
    @Component({
      standalone: true,
      imports: [SngProgress],
      template: `<sng-progress [value]="value" />`,
    })
    class BoundsTestComponent {
      value = 150;
    }

    it('should clamp values above 100 for aria and transform', async () => {
      await TestBed.configureTestingModule({
        imports: [BoundsTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(BoundsTestComponent);
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('sng-progress') as HTMLElement;
      const indicator = progress.querySelector('div') as HTMLElement;

      expect(progress.getAttribute('aria-valuenow')).toBe('100');
      expect(indicator.style.transform).toBe('translateX(0%)');
    });

    it('should clamp values below 0 for aria and transform', async () => {
      await TestBed.configureTestingModule({
        imports: [BoundsTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(BoundsTestComponent);
      fixture.componentInstance.value = -10;
      fixture.detectChanges();

      const progress = fixture.nativeElement.querySelector('sng-progress') as HTMLElement;
      const indicator = progress.querySelector('div') as HTMLElement;

      expect(progress.getAttribute('aria-valuenow')).toBe('0');
      expect(indicator.style.transform).toBe('translateX(-100%)');
    });
  });
});

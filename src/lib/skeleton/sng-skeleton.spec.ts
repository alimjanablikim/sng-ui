import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngSkeleton } from './sng-skeleton';

describe('SngSkeleton', () => {
  describe('Basic functionality', () => {
    @Component({
      standalone: true,
      imports: [SngSkeleton],
      template: `<sng-skeleton />`,
    })
    class BasicTestComponent {}

    let fixture: ComponentFixture<BasicTestComponent>;
    let skeleton: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      skeleton = fixture.nativeElement.querySelector('sng-skeleton');
    });

    it('should create', () => {
      expect(skeleton).toBeTruthy();
    });

    it('should have animate-pulse class', () => {
      expect(skeleton.classList.contains('animate-pulse')).toBeTrue();
    });

    it('should have rounded-md class', () => {
      expect(skeleton.classList.contains('rounded-md')).toBeTrue();
    });

    it('should have bg-accent class', () => {
      expect(skeleton.classList.contains('bg-accent')).toBeTrue();
    });

    it('should be a block element', () => {
      expect(skeleton.classList.contains('block')).toBeTrue();
    });
  });

  describe('Dimension classes', () => {
    @Component({
      standalone: true,
      imports: [SngSkeleton],
      template: `<sng-skeleton class="h-4 w-[250px]" />`,
    })
    class DimensionTestComponent {}

    it('should apply dimension classes', async () => {
      await TestBed.configureTestingModule({
        imports: [DimensionTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(DimensionTestComponent);
      fixture.detectChanges();

      const skeleton = fixture.nativeElement.querySelector('sng-skeleton');
      expect(skeleton.classList.contains('h-4')).toBeTrue();
      expect(skeleton.classList.contains('w-[250px]')).toBeTrue();
    });
  });

  describe('Circle shape', () => {
    @Component({
      standalone: true,
      imports: [SngSkeleton],
      template: `<sng-skeleton class="h-12 w-12 rounded-full" />`,
    })
    class CircleTestComponent {}

    it('should apply circle shape', async () => {
      await TestBed.configureTestingModule({
        imports: [CircleTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(CircleTestComponent);
      fixture.detectChanges();

      const skeleton = fixture.nativeElement.querySelector('sng-skeleton');
      expect(skeleton.classList.contains('rounded-full')).toBeTrue();
    });
  });

  describe('Text line placeholder', () => {
    @Component({
      standalone: true,
      imports: [SngSkeleton],
      template: `
        <div class="space-y-2">
          <sng-skeleton class="h-4 w-[250px]" />
          <sng-skeleton class="h-4 w-[200px]" />
        </div>
      `,
    })
    class TextLinesComponent {}

    it('should work for text line placeholder', async () => {
      await TestBed.configureTestingModule({
        imports: [TextLinesComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(TextLinesComponent);
      fixture.detectChanges();

      const skeletons = fixture.nativeElement.querySelectorAll('sng-skeleton');
      expect(skeletons.length).toBe(2);
    });
  });

  describe('Avatar placeholder', () => {
    @Component({
      standalone: true,
      imports: [SngSkeleton],
      template: `<sng-skeleton class="h-12 w-12 rounded-full" />`,
    })
    class AvatarComponent {}

    it('should work for avatar placeholder', async () => {
      await TestBed.configureTestingModule({
        imports: [AvatarComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(AvatarComponent);
      fixture.detectChanges();

      const avatarSkeleton = fixture.nativeElement.querySelector('sng-skeleton');
      expect(avatarSkeleton.classList.contains('rounded-full')).toBeTrue();
    });
  });
});

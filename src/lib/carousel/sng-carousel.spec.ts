import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, ViewChild } from '@angular/core';
import {
  SngCarousel,
  SngCarouselContent,
  SngCarouselItem,
  SngCarouselPrevious,
  SngCarouselNext,
} from './sng-carousel';

@Component({
  standalone: true,
  imports: [SngCarousel, SngCarouselContent, SngCarouselItem, SngCarouselPrevious, SngCarouselNext],
  template: `
    <sng-carousel [orientation]="orientation" [class]="carouselClass">
      <sng-carousel-content>
        <sng-carousel-item>Slide 1</sng-carousel-item>
        <sng-carousel-item>Slide 2</sng-carousel-item>
        <sng-carousel-item>Slide 3</sng-carousel-item>
      </sng-carousel-content>
      <sng-carousel-previous />
      <sng-carousel-next />
    </sng-carousel>
  `,
})
class TestHostComponent {
  @ViewChild(SngCarousel) carousel!: SngCarousel;
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  carouselClass = '';
}

describe('SngCarousel', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

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
      const carousel = fixture.nativeElement.querySelector('sng-carousel');
      expect(carousel).toBeTruthy();
    });

    it('should render carousel items', () => {
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('sng-carousel-item');
      expect(items.length).toBe(3);
    });

    it('should have role="region" on container', () => {
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector('[role="region"]');
      expect(container).toBeTruthy();
    });

    it('should have aria-roledescription="carousel"', () => {
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector('[aria-roledescription="carousel"]');
      expect(container).toBeTruthy();
    });

  });

  describe('Carousel items', () => {
    it('should have role="group" on items', () => {
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('[role="group"]');
      expect(items.length).toBe(3);
    });

    it('should have aria-roledescription="slide"', () => {
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('[aria-roledescription="slide"]');
      expect(items.length).toBe(3);
    });
  });

  describe('Navigation buttons', () => {
    it('should render previous button', () => {
      fixture.detectChanges();
      const prevBtn = fixture.nativeElement.querySelector('sng-carousel-previous');
      expect(prevBtn).toBeTruthy();
    });

    it('should render next button', () => {
      fixture.detectChanges();
      const nextBtn = fixture.nativeElement.querySelector('sng-carousel-next');
      expect(nextBtn).toBeTruthy();
    });

    it('should have screen reader text', () => {
      fixture.detectChanges();
      const prevBtn = fixture.nativeElement.querySelector('sng-carousel-previous');
      const nextBtn = fixture.nativeElement.querySelector('sng-carousel-next');

      expect(prevBtn.querySelector('.sr-only')?.textContent).toContain('Previous');
      expect(nextBtn.querySelector('.sr-only')?.textContent).toContain('Next');
    });
  });

  describe('Orientation', () => {
    it('should apply horizontal styles by default', () => {
      fixture.detectChanges();
      const content = fixture.nativeElement.querySelector('sng-carousel-content');
      const container = content.querySelector('div > div');
      expect(container.classList.contains('flex')).toBeTrue();
    });

    it('should apply vertical styles when orientation is vertical', () => {
      host.orientation = 'vertical';
      fixture.detectChanges();

      const content = fixture.nativeElement.querySelector('sng-carousel-content');
      const container = content.querySelector('div > div');
      expect(container.classList.contains('flex-col')).toBeTrue();
    });
  });

  describe('Class input', () => {
    it('should apply custom classes', () => {
      host.carouselClass = 'max-w-xs';
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('[role="region"]');
      expect(container.classList.contains('max-w-xs')).toBeTrue();
    });
  });

});

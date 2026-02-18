import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { SngAvatar } from './sng-avatar';
import { SngAvatarImage } from './sng-avatar-image';
import { SngAvatarFallback } from './sng-avatar-fallback';

describe('SngAvatar', () => {
  const TEST_IMAGE_1 = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
  const TEST_IMAGE_2 = 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

  describe('Basic functionality', () => {
    @Component({
      standalone: true,
      imports: [SngAvatar, SngAvatarImage, SngAvatarFallback],
      template: `
        <sng-avatar>
          <sng-avatar-image src="https://example.com/avatar.jpg" alt="User avatar" />
          <sng-avatar-fallback>CN</sng-avatar-fallback>
        </sng-avatar>
      `,
    })
    class BasicTestComponent {}

    let fixture: ComponentFixture<BasicTestComponent>;
    let avatar: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(BasicTestComponent);
      fixture.detectChanges();
      avatar = fixture.nativeElement.querySelector('sng-avatar');
    });

    it('should create', () => {
      expect(avatar).toBeTruthy();
    });

    it('should have relative class', () => {
      expect(avatar.classList.contains('relative')).toBeTrue();
    });

    it('should have flex class', () => {
      expect(avatar.classList.contains('flex')).toBeTrue();
    });

    it('should have rounded-full class', () => {
      expect(avatar.classList.contains('rounded-full')).toBeTrue();
    });

    it('should have default size', () => {
      expect(avatar.classList.contains('size-10')).toBeTrue();
    });
  });

  describe('Avatar image', () => {
    @Component({
      standalone: true,
      imports: [SngAvatar, SngAvatarImage, SngAvatarFallback],
      template: `
        <sng-avatar>
          <sng-avatar-image src="https://example.com/avatar.jpg" alt="User" />
          <sng-avatar-fallback>CN</sng-avatar-fallback>
        </sng-avatar>
      `,
    })
    class ImageTestComponent {}

    let fixture: ComponentFixture<ImageTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ImageTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(ImageTestComponent);
      fixture.detectChanges();
    });

    it('should render image component', () => {
      const image = fixture.nativeElement.querySelector('sng-avatar-image');
      expect(image).toBeTruthy();
    });

    it('should render img element', () => {
      const img = fixture.nativeElement.querySelector('sng-avatar-image img');
      expect(img).toBeTruthy();
    });
  });

  describe('Avatar fallback', () => {
    @Component({
      standalone: true,
      imports: [SngAvatar, SngAvatarImage, SngAvatarFallback],
      template: `
        <sng-avatar>
          <sng-avatar-image src="https://example.com/avatar.jpg" alt="User" />
          <sng-avatar-fallback>CN</sng-avatar-fallback>
        </sng-avatar>
      `,
    })
    class FallbackTestComponent {}

    let fixture: ComponentFixture<FallbackTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FallbackTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(FallbackTestComponent);
      fixture.detectChanges();
    });

    it('should render fallback component', () => {
      const fallback = fixture.nativeElement.querySelector('sng-avatar-fallback');
      expect(fallback).toBeTruthy();
    });

    it('should have fallback text', () => {
      const fallback = fixture.nativeElement.querySelector('sng-avatar-fallback');
      expect(fallback.textContent).toContain('CN');
    });
  });

  describe('Custom size', () => {
    @Component({
      standalone: true,
      imports: [SngAvatar, SngAvatarFallback],
      template: `
        <sng-avatar class="size-16">
          <sng-avatar-fallback>XL</sng-avatar-fallback>
        </sng-avatar>
      `,
    })
    class CustomSizeTestComponent {}

    it('should apply custom size classes', async () => {
      await TestBed.configureTestingModule({
        imports: [CustomSizeTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(CustomSizeTestComponent);
      fixture.detectChanges();

      const avatar = fixture.nativeElement.querySelector('sng-avatar');
      expect(avatar.classList.contains('size-16')).toBeTrue();
    });
  });

  describe('Fallback only', () => {
    @Component({
      standalone: true,
      imports: [SngAvatar, SngAvatarFallback],
      template: `
        <sng-avatar>
          <sng-avatar-fallback>JD</sng-avatar-fallback>
        </sng-avatar>
      `,
    })
    class FallbackOnlyComponent {}

    it('should work with fallback only', async () => {
      await TestBed.configureTestingModule({
        imports: [FallbackOnlyComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(FallbackOnlyComponent);
      fixture.detectChanges();

      const avatar = fixture.nativeElement.querySelector('sng-avatar');
      expect(avatar).toBeTruthy();

      const fallback = fixture.nativeElement.querySelector('sng-avatar-fallback');
      expect(fallback.textContent).toContain('JD');
    });
  });

  describe('Image state transitions', () => {
    @Component({
      standalone: true,
      imports: [SngAvatar, SngAvatarImage, SngAvatarFallback],
      template: `
        <sng-avatar>
          <sng-avatar-image [src]="src()" alt="User" />
          <sng-avatar-fallback>JD</sng-avatar-fallback>
        </sng-avatar>
      `,
    })
    class ImageStateTestComponent {
      src = signal(TEST_IMAGE_1);
    }

    let fixture: ComponentFixture<ImageStateTestComponent>;
    let component: ImageStateTestComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ImageStateTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(ImageStateTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should show fallback before image load', () => {
      const imageHost = fixture.nativeElement.querySelector('sng-avatar-image') as HTMLElement;
      const fallbackHost = fixture.nativeElement.querySelector('sng-avatar-fallback') as HTMLElement;

      expect(imageHost.style.display).toBe('none');
      expect(fallbackHost.style.display).toBe('flex');
    });

    it('should show image and hide fallback after load', () => {
      const img = fixture.nativeElement.querySelector('sng-avatar-image img') as HTMLImageElement;
      img.dispatchEvent(new Event('load'));
      fixture.detectChanges();

      const imageHost = fixture.nativeElement.querySelector('sng-avatar-image') as HTMLElement;
      const fallbackHost = fixture.nativeElement.querySelector('sng-avatar-fallback') as HTMLElement;

      expect(imageHost.style.display).toBe('');
      expect(fallbackHost.style.display).toBe('none');
    });

    it('should show fallback after image error', () => {
      const img = fixture.nativeElement.querySelector('sng-avatar-image img') as HTMLImageElement;
      img.dispatchEvent(new Event('error'));
      fixture.detectChanges();

      const imageHost = fixture.nativeElement.querySelector('sng-avatar-image') as HTMLElement;
      const fallbackHost = fixture.nativeElement.querySelector('sng-avatar-fallback') as HTMLElement;

      expect(imageHost.style.display).toBe('none');
      expect(fallbackHost.style.display).toBe('flex');
    });

    it('should reset to fallback when src changes', () => {
      const img = fixture.nativeElement.querySelector('sng-avatar-image img') as HTMLImageElement;
      img.dispatchEvent(new Event('load'));
      fixture.detectChanges();

      component.src.set(TEST_IMAGE_2);
      fixture.detectChanges();

      const imageHost = fixture.nativeElement.querySelector('sng-avatar-image') as HTMLElement;
      const fallbackHost = fixture.nativeElement.querySelector('sng-avatar-fallback') as HTMLElement;

      expect(imageHost.style.display).toBe('none');
      expect(fallbackHost.style.display).toBe('flex');
    });
  });
});

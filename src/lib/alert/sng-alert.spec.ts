import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngAlert } from './sng-alert';
import { SngAlertTitle } from './sng-alert-title';
import { SngAlertDescription } from './sng-alert-description';

describe('SngAlert', () => {
  describe('Basic functionality', () => {
    @Component({
      standalone: true,
      imports: [SngAlert, SngAlertTitle, SngAlertDescription],
      template: `
        <sng-alert>
          <svg class="h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
          <sng-alert-title>Heads up!</sng-alert-title>
          <sng-alert-description>
            This is an alert description.
          </sng-alert-description>
        </sng-alert>
      `,
    })
    class BasicTestComponent {}

    let fixture: ComponentFixture<BasicTestComponent>;
    let alert: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BasicTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(BasicTestComponent);
    });

    it('should create', () => {
      fixture.detectChanges();
      alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert).toBeTruthy();
    });

    it('should have role="alert"', () => {
      fixture.detectChanges();
      alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert.getAttribute('role')).toBe('alert');
    });

    it('should render icon', () => {
      fixture.detectChanges();
      alert = fixture.nativeElement.querySelector('sng-alert');
      const icon = alert.querySelector('svg');
      expect(icon).toBeTruthy();
    });
  });

  describe('Alert content', () => {
    @Component({
      standalone: true,
      imports: [SngAlert, SngAlertTitle, SngAlertDescription],
      template: `
        <sng-alert>
          <sng-alert-title>Heads up!</sng-alert-title>
          <sng-alert-description>This is an alert description.</sng-alert-description>
        </sng-alert>
      `,
    })
    class ContentTestComponent {}

    let fixture: ComponentFixture<ContentTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ContentTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(ContentTestComponent);
    });

    it('should render title', () => {
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector('sng-alert-title');
      expect(title).toBeTruthy();
      expect(title.textContent).toContain('Heads up!');
    });

    it('should render description', () => {
      fixture.detectChanges();
      const description = fixture.nativeElement.querySelector('sng-alert-description');
      expect(description).toBeTruthy();
      expect(description.textContent).toContain('This is an alert description');
    });
  });

  describe('Styling', () => {
    @Component({
      standalone: true,
      imports: [SngAlert, SngAlertTitle],
      template: `
        <sng-alert>
          <sng-alert-title>Test</sng-alert-title>
        </sng-alert>
      `,
    })
    class StyleTestComponent {}

    let fixture: ComponentFixture<StyleTestComponent>;
    let alert: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StyleTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      fixture = TestBed.createComponent(StyleTestComponent);
    });

    it('should have grid layout', () => {
      fixture.detectChanges();
      alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert.classList.contains('grid')).toBeTrue();
    });

    it('should have border class', () => {
      fixture.detectChanges();
      alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert.classList.contains('border')).toBeTrue();
    });

    it('should have rounded-lg class', () => {
      fixture.detectChanges();
      alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert.classList.contains('rounded-lg')).toBeTrue();
    });

    it('should have relative positioning', () => {
      fixture.detectChanges();
      alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert.classList.contains('relative')).toBeTrue();
    });

    it('should have bg-card class', () => {
      fixture.detectChanges();
      alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert.classList.contains('bg-card')).toBeTrue();
    });
  });

  describe('Destructive variant', () => {
    @Component({
      standalone: true,
      imports: [SngAlert, SngAlertTitle],
      template: `
        <sng-alert class="border-destructive text-destructive">
          <sng-alert-title>Error</sng-alert-title>
        </sng-alert>
      `,
    })
    class DestructiveTestComponent {}

    it('should apply destructive classes', async () => {
      await TestBed.configureTestingModule({
        imports: [DestructiveTestComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(DestructiveTestComponent);
      fixture.detectChanges();

      const alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert.classList.contains('border-destructive')).toBeTrue();
      expect(alert.classList.contains('text-destructive')).toBeTrue();
    });
  });

  describe('Without icon', () => {
    @Component({
      standalone: true,
      imports: [SngAlert, SngAlertTitle, SngAlertDescription],
      template: `
        <sng-alert>
          <sng-alert-title>No Icon</sng-alert-title>
          <sng-alert-description>Description without icon.</sng-alert-description>
        </sng-alert>
      `,
    })
    class NoIconComponent {}

    it('should work without icon', async () => {
      await TestBed.configureTestingModule({
        imports: [NoIconComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(NoIconComponent);
      fixture.detectChanges();

      const noIconAlert = fixture.nativeElement.querySelector('sng-alert');
      expect(noIconAlert).toBeTruthy();
      expect(noIconAlert.querySelector('sng-alert-title')).toBeTruthy();
    });
  });

  describe('Class-based customization', () => {
    @Component({
      standalone: true,
      imports: [SngAlert, SngAlertTitle],
      template: `
        <sng-alert>
          <sng-alert-title>Test</sng-alert-title>
        </sng-alert>
      `,
    })
    class DefaultClassComponent {}

    it('should have default classes', async () => {
      await TestBed.configureTestingModule({
        imports: [DefaultClassComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(DefaultClassComponent);
      fixture.detectChanges();

      const alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert.classList.contains('bg-card')).toBeTrue();
      expect(alert.classList.contains('text-card-foreground')).toBeTrue();
    });

    it('should merge custom classes via class input', async () => {
      @Component({
        standalone: true,
        imports: [SngAlert, SngAlertTitle],
        template: `
          <sng-alert class="text-destructive">
            <sng-alert-title>Error</sng-alert-title>
          </sng-alert>
        `,
      })
      class CustomClassComponent {}

      await TestBed.configureTestingModule({
        imports: [CustomClassComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();

      const fixture = TestBed.createComponent(CustomClassComponent);
      fixture.detectChanges();

      const alert = fixture.nativeElement.querySelector('sng-alert');
      expect(alert.classList.contains('text-destructive')).toBeTrue();
      expect(alert.classList.contains('bg-card')).toBeTrue();
    });
  });
});

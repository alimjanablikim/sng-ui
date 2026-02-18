import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngButton } from './sng-button';

@Component({
  standalone: true,
  imports: [SngButton],
  template: `
    <sng-button [class]="buttonClass" [disabled]="disabled" [loading]="loading">
      Click me
    </sng-button>
  `,
})
class TestHostComponent {
  buttonClass = '';
  disabled = false;
  loading = false;
}

describe('SngButton', () => {
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

  // Helper to get the inner button element
  const getButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');

  describe('Basic functionality', () => {
    it('should create', () => {
      fixture.detectChanges();
      const button = getButton();
      expect(button).toBeTruthy();
    });

    it('should render content', () => {
      fixture.detectChanges();
      const button = getButton();
      expect(button.textContent?.trim()).toBe('Click me');
    });

    it('should apply base classes', () => {
      fixture.detectChanges();
      const button = getButton();
      expect(button.classList.contains('inline-flex')).toBeTrue();
      expect(button.classList.contains('items-center')).toBeTrue();
      expect(button.classList.contains('justify-center')).toBeTrue();
    });

    it('should have default button type', () => {
      fixture.detectChanges();
      const button = getButton();
      expect(button.type).toBe('button');
    });
  });

  describe('Class input', () => {
    it('should apply custom classes', () => {
      host.buttonClass = 'bg-secondary text-secondary-foreground';
      fixture.detectChanges();
      const button = getButton();

      expect(button.classList.contains('bg-secondary')).toBeTrue();
      expect(button.classList.contains('text-secondary-foreground')).toBeTrue();
    });

    it('should apply primary style classes', () => {
      host.buttonClass = 'bg-primary text-primary-foreground';
      fixture.detectChanges();
      const button = getButton();

      expect(button.classList.contains('bg-primary')).toBeTrue();
      expect(button.classList.contains('text-primary-foreground')).toBeTrue();
    });

    it('should apply destructive style classes', () => {
      host.buttonClass = 'bg-destructive text-white';
      fixture.detectChanges();
      const button = getButton();

      expect(button.classList.contains('bg-destructive')).toBeTrue();
      expect(button.classList.contains('text-white')).toBeTrue();
    });
  });

  describe('Disabled state', () => {
    it('should set disabled attribute when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      const button = getButton();

      expect(button.disabled).toBeTrue();
    });

    it('should set aria-disabled when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      const button = getButton();

      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not have disabled attribute when enabled', () => {
      fixture.detectChanges();
      const button = getButton();
      expect(button.disabled).toBeFalse();
    });
  });

  describe('Loading state', () => {
    it('should show spinner when loading', () => {
      host.loading = true;
      fixture.detectChanges();
      const button = getButton();

      const spinner = button.querySelector('svg');
      expect(spinner).toBeTruthy();
      expect(spinner?.classList.contains('animate-spin')).toBeTrue();
    });

    it('should not show spinner when not loading', () => {
      fixture.detectChanges();
      const button = getButton();
      const spinner = button.querySelector('svg.animate-spin');
      expect(spinner).toBeFalsy();
    });

    it('should set aria-busy when loading', () => {
      host.loading = true;
      fixture.detectChanges();
      const button = getButton();

      expect(button.getAttribute('aria-busy')).toBe('true');
    });

    it('should set disabled when loading', () => {
      host.loading = true;
      fixture.detectChanges();
      const button = getButton();

      expect(button.disabled).toBeTrue();
    });
  });

  describe('Anchor button', () => {
    it('should render anchor when href is provided', async () => {
      @Component({
        standalone: true,
        imports: [SngButton],
        template: `<sng-button href="#">Link Button</sng-button>`,
      })
      class AnchorTestComponent {}

      const anchorFixture = TestBed.createComponent(AnchorTestComponent);
      anchorFixture.detectChanges();

      const anchor = anchorFixture.nativeElement.querySelector('a');
      expect(anchor).toBeTruthy();
      expect(anchor.classList.contains('inline-flex')).toBeTrue();
      expect(anchor.getAttribute('href')).toBe('#');
    });

    it('should apply custom classes to anchor', async () => {
      @Component({
        standalone: true,
        imports: [SngButton],
        template: `<sng-button href="#" class="bg-primary text-primary-foreground">Link</sng-button>`,
      })
      class AnchorClassTestComponent {}

      const anchorFixture = TestBed.createComponent(AnchorClassTestComponent);
      anchorFixture.detectChanges();

      const anchor = anchorFixture.nativeElement.querySelector('a');
      expect(anchor.classList.contains('bg-primary')).toBeTrue();
    });

    it('should set target and rel attributes', async () => {
      @Component({
        standalone: true,
        imports: [SngButton],
        template: `<sng-button href="https://example.com" target="_blank" rel="noopener noreferrer">External</sng-button>`,
      })
      class AnchorAttributesTestComponent {}

      const anchorFixture = TestBed.createComponent(AnchorAttributesTestComponent);
      anchorFixture.detectChanges();

      const anchor = anchorFixture.nativeElement.querySelector('a');
      expect(anchor.getAttribute('target')).toBe('_blank');
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('should default rel for target _blank', async () => {
      @Component({
        standalone: true,
        imports: [SngButton],
        template: `<sng-button href="https://example.com" target="_blank">External</sng-button>`,
      })
      class AnchorTargetOnlyTestComponent {}

      const anchorFixture = TestBed.createComponent(AnchorTargetOnlyTestComponent);
      anchorFixture.detectChanges();

      const anchor = anchorFixture.nativeElement.querySelector('a');
      expect(anchor.getAttribute('target')).toBe('_blank');
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('should ignore javascript href values', async () => {
      @Component({
        standalone: true,
        imports: [SngButton],
        template: `<sng-button href="javascript:void(0)">Unsafe</sng-button>`,
      })
      class UnsafeHrefComponent {}

      const unsafeFixture = TestBed.createComponent(UnsafeHrefComponent);
      unsafeFixture.detectChanges();

      const button = unsafeFixture.nativeElement.querySelector('button');
      const anchor = unsafeFixture.nativeElement.querySelector('a');
      expect(button).toBeTruthy();
      expect(anchor.getAttribute('href')).toBeNull();
    });
  });

  describe('Button type', () => {
    it('should support submit type', async () => {
      @Component({
        standalone: true,
        imports: [SngButton],
        template: `<sng-button type="submit">Submit</sng-button>`,
      })
      class SubmitButtonComponent {}

      const submitFixture = TestBed.createComponent(SubmitButtonComponent);
      submitFixture.detectChanges();

      const button = submitFixture.nativeElement.querySelector('button');
      expect(button.type).toBe('submit');
    });

    it('should support reset type', async () => {
      @Component({
        standalone: true,
        imports: [SngButton],
        template: `<sng-button type="reset">Reset</sng-button>`,
      })
      class ResetButtonComponent {}

      const resetFixture = TestBed.createComponent(ResetButtonComponent);
      resetFixture.detectChanges();

      const button = resetFixture.nativeElement.querySelector('button');
      expect(button.type).toBe('reset');
    });
  });
});

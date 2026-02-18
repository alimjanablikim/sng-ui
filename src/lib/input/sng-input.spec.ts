import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngInput } from './sng-input';

@Component({
  standalone: true,
  imports: [SngInput],
  template: `
    <sng-input [class]="inputClass" [placeholder]="placeholder" [disabled]="disabled" />
  `,
})
class TestHostComponent {
  inputClass = '';
  placeholder = 'Enter text';
  disabled = false;
}

describe('SngInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let input: HTMLInputElement;

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
      const wrapper = fixture.nativeElement.querySelector('sng-input');
      expect(wrapper).toBeTruthy();
      input = fixture.nativeElement.querySelector('sng-input input');
      expect(input).toBeTruthy();
    });

    it('should apply placeholder', () => {
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('sng-input input');
      expect(input.placeholder).toBe('Enter text');
    });

    it('should apply base classes', () => {
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('sng-input input');
      expect(input.classList.contains('flex')).toBeTrue();
      expect(input.classList.contains('w-full')).toBeTrue();
      expect(input.classList.contains('rounded-md')).toBeTrue();
    });

    it('should not render id or name when not provided', () => {
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('sng-input input');
      expect(input.getAttribute('id')).toBeNull();
      expect(input.getAttribute('name')).toBeNull();
    });

    it('should render autofocus attribute when enabled', () => {
      @Component({
        standalone: true,
        imports: [SngInput],
        template: `<sng-input autofocus />`,
      })
      class AutofocusTestComponent {}

      const autofocusFixture = TestBed.createComponent(AutofocusTestComponent);
      autofocusFixture.detectChanges();
      const autofocusInput = autofocusFixture.nativeElement.querySelector('sng-input input') as HTMLInputElement;
      expect(autofocusInput.hasAttribute('autofocus')).toBeTrue();
    });

    it('should keep id and name on internal input only', async () => {
      @Component({
        standalone: true,
        imports: [SngInput],
        template: `<sng-input id="email-field" name="email" />`,
      })
      class IdNameTestComponent {}

      const idNameFixture = TestBed.createComponent(IdNameTestComponent);
      idNameFixture.detectChanges();

      const hostEl = idNameFixture.nativeElement.querySelector('sng-input') as HTMLElement;
      const internalInput = idNameFixture.nativeElement.querySelector('sng-input input') as HTMLInputElement;

      expect(hostEl.getAttribute('id')).toBeNull();
      expect(hostEl.getAttribute('name')).toBeNull();
      expect(internalInput.id).toBe('email-field');
      expect(internalInput.getAttribute('name')).toBe('email');
    });
  });

  describe('Class input', () => {
    it('should apply custom classes', () => {
      host.inputClass = 'h-12 text-lg';
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('sng-input input');

      expect(input.classList.contains('h-12')).toBeTrue();
      expect(input.classList.contains('text-lg')).toBeTrue();
    });
  });

  describe('Disabled state', () => {
    it('should apply disabled styles when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('sng-input input');

      expect(input.disabled).toBeTrue();
    });
  });

  describe('Different input types', () => {
    it('should work with different input types', async () => {
      @Component({
        standalone: true,
        imports: [SngInput],
        template: `
          <sng-input type="password" />
          <sng-input type="email" />
          <sng-input type="number" />
        `,
      })
      class TypeTestComponent {}

      const typeFixture = TestBed.createComponent(TypeTestComponent);
      typeFixture.detectChanges();

      const inputs = typeFixture.nativeElement.querySelectorAll('sng-input input');
      expect(inputs[0].type).toBe('password');
      expect(inputs[1].type).toBe('email');
      expect(inputs[2].type).toBe('number');
    });
  });
});

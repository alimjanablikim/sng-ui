import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SngSearchInput } from './sng-search-input';

@Component({
  standalone: true,
  imports: [SngSearchInput],
  template: `
    <sng-search-input
      [(value)]="searchValue"
      [placeholder]="placeholder"
      [command]="command"
      [showClearButton]="showClearButton"
      [disabled]="disabled"
      [id]="inputId"
      [name]="inputName"
      [autofocus]="autofocus"
      [class]="customClass"
    />
  `,
})
class TestHostComponent {
  searchValue = '';
  placeholder = 'Search...';
  command = false;
  showClearButton = true;
  disabled = false;
  inputId: string | undefined = undefined;
  inputName: string | undefined = undefined;
  autofocus = false;
  customClass = '';
}

describe('SngSearchInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let searchInput: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    searchInput = fixture.nativeElement.querySelector('sng-search-input');
    expect(searchInput).toBeTruthy();
  });

  it('should have search input field', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should apply placeholder', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Search...');
  });

  it('should apply custom class', () => {
    host.customClass = 'max-w-sm';
    fixture.detectChanges();
    searchInput = fixture.nativeElement.querySelector('sng-search-input');
    expect(searchInput.classList.contains('max-w-sm')).toBeTrue();
  });

  it('should bind value to input', () => {
    host.searchValue = 'test query';
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('test query');
  });

  it('should have search icon when not in command mode', () => {
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should keep search icon in command mode', () => {
    host.command = true;
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('svg[class*="absolute left-2.5"]');
    expect(icon).toBeTruthy();
  });

  it('should show clear button when value is present', () => {
    host.searchValue = 'test';
    fixture.detectChanges();
    const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    expect(clearButton).toBeTruthy();
  });

  it('should not show clear button when value is empty', () => {
    host.searchValue = '';
    fixture.detectChanges();
    const clearButton = fixture.nativeElement.querySelector('button[aria-label="Clear"]');
    expect(clearButton).toBeFalsy();
  });

  it('should disable input when disabled is true', () => {
    host.disabled = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBeTrue();
  });

  it('should have combobox role', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('role')).toBe('combobox');
  });

  it('should have aria-expanded attribute', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.hasAttribute('aria-expanded')).toBeTrue();
  });

  it('should update value on input', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'new value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.searchValue).toBe('new value');
  });

  it('should not render id or name when not provided', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('id')).toBeNull();
    expect(input.getAttribute('name')).toBeNull();
  });

  it('should render id and name when provided', () => {
    host.inputId = 'search-input-demo';
    host.inputName = 'search-input-demo';
    fixture.detectChanges();
    const hostElement = fixture.nativeElement.querySelector('sng-search-input') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(hostElement.getAttribute('id')).toBeNull();
    expect(hostElement.getAttribute('name')).toBeNull();
    expect(input.getAttribute('id')).toBe('search-input-demo');
    expect(input.getAttribute('name')).toBe('search-input-demo');
  });

  it('should render autofocus when enabled', () => {
    host.autofocus = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.hasAttribute('autofocus')).toBeTrue();
  });

  it('should keep dropdown open when blur moves focus inside component', () => {
    fixture.detectChanges();
    const component = fixture.debugElement.query(By.directive(SngSearchInput)).componentInstance as SngSearchInput;
    const insideTarget = fixture.nativeElement.querySelector('input') as HTMLElement;
    (component as any)._dropdownOpen.set(true);
    const blurEvent = new FocusEvent('blur');
    Object.defineProperty(blurEvent, 'relatedTarget', { value: insideTarget });

    component.onBlur(blurEvent);

    expect((component as any)._dropdownOpen()).toBeTrue();
  });

  it('should close dropdown when blur moves focus outside component', () => {
    fixture.detectChanges();
    const component = fixture.debugElement.query(By.directive(SngSearchInput)).componentInstance as SngSearchInput;
    const outsideTarget = document.createElement('button');
    document.body.appendChild(outsideTarget);
    (component as any)._dropdownOpen.set(true);
    const blurEvent = new FocusEvent('blur');
    Object.defineProperty(blurEvent, 'relatedTarget', { value: outsideTarget });

    component.onBlur(blurEvent);

    expect((component as any)._dropdownOpen()).toBeFalse();
    outsideTarget.remove();
  });
});

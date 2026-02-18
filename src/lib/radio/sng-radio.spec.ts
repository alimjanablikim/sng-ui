import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { SngRadio } from './sng-radio';
import { SngRadioItem } from './sng-radio-item';

@Component({
  standalone: true,
  imports: [SngRadio, SngRadioItem],
  template: `
    <sng-radio
      [(value)]="selected"
      [disabled]="disabled()"
      [class]="customClass()"
    >
      <sng-radio-item value="option1" />
      <sng-radio-item value="option2" />
      <sng-radio-item value="option3" [disabled]="itemDisabled()" />
    </sng-radio>
  `,
})
class TestHostComponent {
  selected = signal('');
  disabled = signal(false);
  itemDisabled = signal(false);
  customClass = signal('');
}

describe('SngRadio', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let radioGroup: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    radioGroup = fixture.nativeElement.querySelector('sng-radio');
    expect(radioGroup).toBeTruthy();
    expect(radioGroup.getAttribute('role')).toBe('radiogroup');
  });

  it('should have correct number of radio items', () => {
    const items = fixture.nativeElement.querySelectorAll('sng-radio-item');
    expect(items.length).toBe(3);
  });

  it('should select item on click', async () => {
    const items = fixture.nativeElement.querySelectorAll('sng-radio-item');
    items[1].click();
    await fixture.whenStable();
    expect(host.selected()).toBe('option2');
  });

  it('should show checked state on selected item', async () => {
    host.selected.set('option1');
    fixture.detectChanges();
    await fixture.whenStable();

    const items = fixture.nativeElement.querySelectorAll('sng-radio-item');
    expect(items[0].getAttribute('aria-checked')).toBe('true');
    expect(items[1].getAttribute('aria-checked')).toBe('false');
  });

  it('should disable all items when group is disabled', async () => {
    host.disabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    radioGroup = fixture.nativeElement.querySelector('sng-radio');
    expect(radioGroup.getAttribute('aria-disabled')).toBe('true');

    const items = fixture.nativeElement.querySelectorAll('sng-radio-item');
    items[0].click();
    await fixture.whenStable();
    expect(host.selected()).toBe('');
  });

  it('should disable individual item', async () => {
    host.itemDisabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const items = fixture.nativeElement.querySelectorAll('sng-radio-item');
    expect(items[2].getAttribute('aria-disabled')).toBe('true');

    items[2].click();
    await fixture.whenStable();
    expect(host.selected()).toBe('');
  });

  it('should apply custom class', async () => {
    host.customClass.set('custom-class');
    fixture.detectChanges();
    await fixture.whenStable();

    radioGroup = fixture.nativeElement.querySelector('sng-radio');
    expect(radioGroup.classList.contains('custom-class')).toBeTrue();
  });

  it('should have correct data-state attributes', async () => {
    host.selected.set('option2');
    fixture.detectChanges();
    await fixture.whenStable();

    const items = fixture.nativeElement.querySelectorAll('sng-radio-item');
    expect(items[0].getAttribute('data-state')).toBe('unchecked');
    expect(items[1].getAttribute('data-state')).toBe('checked');
    expect(items[2].getAttribute('data-state')).toBe('unchecked');
  });

  it('should keep all enabled items focusable without roving tabindex logic', () => {
    const items = fixture.nativeElement.querySelectorAll('sng-radio-item');
    expect(items[0].getAttribute('tabindex')).toBe('0');
    expect(items[1].getAttribute('tabindex')).toBe('0');
    expect(items[2].getAttribute('tabindex')).toBe('0');
  });

  it('should set tabindex -1 for disabled items', async () => {
    host.itemDisabled.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const items = fixture.nativeElement.querySelectorAll('sng-radio-item');
    expect(items[2].getAttribute('tabindex')).toBe('-1');
  });
});

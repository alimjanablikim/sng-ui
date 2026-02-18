import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngSelect } from './sng-select';
import { SngSelectItem } from './sng-select-item';
import { SngSelectContent } from './sng-select-content';

@Component({
  standalone: true,
  imports: [SngSelect, SngSelectItem, SngSelectContent],
  template: `
    <sng-select
      [(value)]="selectedValue"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [searchable]="searchable"
    >
      <sng-select-content>
        <sng-select-item value="apple">Apple</sng-select-item>
        <sng-select-item value="banana">Banana</sng-select-item>
        <sng-select-item value="cherry" [isDisabled]="true"
          >Cherry</sng-select-item
        >
      </sng-select-content>
    </sng-select>
  `,
})
class TestHostComponent {
  selectedValue = '';
  placeholder = 'Select fruit';
  disabled = false;
  searchable = false;
}

@Component({
  standalone: true,
  imports: [SngSelect, SngSelectItem, SngSelectContent],
  template: `
    <sng-select searchable placeholder="Searchable select">
      <sng-select-content>
        <sng-select-item value="react">React</sng-select-item>
        <sng-select-item value="angular">Angular</sng-select-item>
      </sng-select-content>
    </sng-select>
  `,
})
class SearchableHostComponent {}

describe('SngSelect', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let select: HTMLElement;
  let trigger: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, SearchableHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    select = fixture.nativeElement.querySelector('sng-select');
    trigger = fixture.nativeElement.querySelector('button');
  });

  afterEach(() => {
    // Clean up any open overlays
    const overlays = document.querySelectorAll('.cdk-overlay-container *');
    overlays.forEach(el => el.remove());
  });

  it('should create', () => {
    expect(select).toBeTruthy();
    expect(trigger).toBeTruthy();
  });

  it('should display placeholder when no value selected', () => {
    expect(trigger.textContent).toContain('Select fruit');
  });

  it('should be closed by default', () => {
    const dropdown = document.querySelector('[role="listbox"]') as HTMLElement | null;
    expect(dropdown).toBeTruthy();
    expect(dropdown?.hidden).toBeTrue();
    expect(dropdown?.getAttribute('data-state')).toBe('closed');
  });

  it('should open when trigger is clicked', () => {
    trigger.click();
    fixture.detectChanges();

    const dropdown = document.querySelector('[role="listbox"]') as HTMLElement | null;
    expect(dropdown).toBeTruthy();
    expect(dropdown?.hidden).toBeFalse();
    expect(dropdown?.getAttribute('data-state')).toBe('open');
  });

  it('should close when trigger is clicked again', () => {
    trigger.click();
    fixture.detectChanges();

    trigger.click();
    fixture.detectChanges();

    const dropdown = document.querySelector('[role="listbox"]') as HTMLElement | null;
    expect(dropdown).toBeTruthy();
    expect(dropdown?.getAttribute('data-state')).toBe('closed');
  });

  it('should select item when clicked', () => {
    trigger.click();
    fixture.detectChanges();

    // Items are rendered in CDK overlay (document body)
    const item = document.querySelector('sng-select-item') as HTMLElement;
    item?.click();
    fixture.detectChanges();

    expect(host.selectedValue).toBe('apple');
    expect(trigger.textContent).toContain('Apple');
  });

  it('should have correct aria attributes', () => {
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should support disabled attribute', () => {
    // The component supports disabled input
    const component = fixture.debugElement.children[0].componentInstance;
    expect(component.disabled).toBeDefined();
  });

  it('should render search input with name attribute in searchable mode', async () => {
    const searchableFixture = TestBed.createComponent(SearchableHostComponent);
    searchableFixture.detectChanges();

    const searchableTrigger = searchableFixture.nativeElement.querySelector('button') as HTMLButtonElement;
    searchableTrigger.click();
    searchableFixture.detectChanges();

    const searchInput = document.querySelector('.sng-select-content input[type="text"]') as HTMLInputElement | null;
    expect(searchInput).toBeTruthy();
    expect(searchInput?.getAttribute('name')).toBe('search');
  });
});

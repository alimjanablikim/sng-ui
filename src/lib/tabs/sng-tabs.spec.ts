import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngTabs } from './sng-tabs';
import { SngTabsList } from './sng-tabs-list';
import { SngTabsTrigger } from './sng-tabs-trigger';
import { SngTabsContent } from './sng-tabs-content';

@Component({
  standalone: true,
  imports: [SngTabs, SngTabsList, SngTabsTrigger, SngTabsContent],
  template: `<sng-tabs
    [defaultValue]="defaultValue"
    [class]="customClass"
    (valueChange)="onValueChange($event)"
  >
    <sng-tabs-list>
      <sng-tabs-trigger value="tab1">Tab 1</sng-tabs-trigger>
      <sng-tabs-trigger value="tab2">Tab 2</sng-tabs-trigger>
    </sng-tabs-list>
    <sng-tabs-content value="tab1">Tab 1 Content</sng-tabs-content>
    <sng-tabs-content value="tab2">Tab 2 Content</sng-tabs-content>
  </sng-tabs>`,
})
class TestHostComponent {
  defaultValue = 'tab1';
  customClass = '';
  emittedValues: string[] = [];

  onValueChange(value: string) {
    this.emittedValues.push(value);
  }
}

describe('SngTabs', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let tabs: HTMLElement;
  let component: SngTabs;

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
    tabs = fixture.nativeElement.querySelector('sng-tabs');
    expect(tabs).toBeTruthy();
  });

  it('should have default value', () => {
    fixture.detectChanges();
    component = fixture.debugElement.children[0].componentInstance;
    expect(component.selectedValue()).toBe('tab1');
  });

  it('should select tab', () => {
    fixture.detectChanges();
    component = fixture.debugElement.children[0].componentInstance;
    component.select('tab2');
    expect(component.selectedValue()).toBe('tab2');
  });

  it('should check if tab is selected', () => {
    fixture.detectChanges();
    component = fixture.debugElement.children[0].componentInstance;
    expect(component.isSelected('tab1')).toBeTrue();
    expect(component.isSelected('tab2')).toBeFalse();
  });

  it('should update selected state after selection', () => {
    fixture.detectChanges();
    component = fixture.debugElement.children[0].componentInstance;
    component.select('tab2');
    expect(component.isSelected('tab1')).toBeFalse();
    expect(component.isSelected('tab2')).toBeTrue();
  });

  it('should apply custom class', () => {
    host.customClass = 'w-full';
    fixture.detectChanges();
    tabs = fixture.nativeElement.querySelector('sng-tabs');
    expect(tabs.classList.contains('w-full')).toBeTrue();
  });

  it('keeps all triggers focusable with browser tab flow', () => {
    fixture.detectChanges();
    const triggers = fixture.nativeElement.querySelectorAll('sng-tabs-trigger');
    expect(triggers.length).toBe(2);
    expect(triggers[0].getAttribute('tabindex')).toBe('0');
    expect(triggers[1].getAttribute('tabindex')).toBe('0');
  });

  it('links trigger and panel ids with aria attributes', () => {
    fixture.detectChanges();

    const triggers = fixture.nativeElement.querySelectorAll('sng-tabs-trigger');
    const contents = fixture.nativeElement.querySelectorAll('sng-tabs-content');

    expect(triggers[0].getAttribute('id')).toContain('trigger-tab1');
    expect(triggers[0].getAttribute('aria-controls')).toContain('content-tab1');
    expect(contents[0].getAttribute('id')).toContain('content-tab1');
    expect(contents[0].getAttribute('aria-labelledby')).toContain('trigger-tab1');
  });

  it('updates selected content and emits valueChange on click', () => {
    fixture.detectChanges();

    const hostElement = fixture.nativeElement as HTMLElement;
    const triggers = hostElement.querySelectorAll('sng-tabs-trigger');
    const panels = hostElement.querySelectorAll('sng-tabs-content');

    (triggers[1] as HTMLElement).click();
    fixture.detectChanges();

    expect(host.emittedValues).toEqual(['tab2']);
    expect(triggers[1].getAttribute('aria-selected')).toBe('true');
    expect(panels[1].hasAttribute('hidden')).toBeFalse();
    expect(panels[0].hasAttribute('hidden')).toBeTrue();
  });
});

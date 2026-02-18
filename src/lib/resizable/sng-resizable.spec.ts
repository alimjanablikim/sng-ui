import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, ViewChild } from '@angular/core';
import { SngResizableGroup, ResizableDirection } from './sng-resizable-group';
import { SngResizablePanel } from './sng-resizable-panel';
import { SngResizableHandle } from './sng-resizable-handle';

@Component({
  standalone: true,
  imports: [SngResizableGroup, SngResizablePanel, SngResizableHandle],
  template: `
    <sng-resizable-group [direction]="direction" [class]="groupClass" style="width: 400px; height: 200px;">
      <sng-resizable-panel [defaultSize]="30" [minSize]="20" [maxSize]="50">
        <div class="panel-1">Panel 1</div>
      </sng-resizable-panel>
      <sng-resizable-handle />
      <sng-resizable-panel [defaultSize]="70">
        <div class="panel-2">Panel 2</div>
      </sng-resizable-panel>
    </sng-resizable-group>
  `,
})
class TestHostComponent {
  @ViewChild(SngResizableGroup) resizableGroup!: SngResizableGroup;
  direction: ResizableDirection = 'horizontal';
  groupClass = '';
}

describe('SngResizable', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let groupEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  describe('SngResizableGroup', () => {
    it('should create', () => {
      fixture.detectChanges();
      groupEl = fixture.nativeElement.querySelector('sng-resizable-group');
      expect(groupEl).toBeTruthy();
    });

    it('should have data-panel-group attribute', () => {
      fixture.detectChanges();
      groupEl = fixture.nativeElement.querySelector('sng-resizable-group');
      expect(groupEl.getAttribute('data-panel-group')).toBe('true');
    });

    it('should have data-direction attribute', () => {
      fixture.detectChanges();
      groupEl = fixture.nativeElement.querySelector('sng-resizable-group');
      expect(groupEl.getAttribute('data-direction')).toBe('horizontal');
    });

    it('should apply flex direction based on orientation', () => {
      fixture.detectChanges();
      groupEl = fixture.nativeElement.querySelector('sng-resizable-group');
      expect(groupEl.classList.contains('flex-row')).toBeTrue();
    });

    it('should support vertical direction', () => {
      host.direction = 'vertical';
      fixture.detectChanges();
      groupEl = fixture.nativeElement.querySelector('sng-resizable-group');
      expect(groupEl.getAttribute('data-direction')).toBe('vertical');
      expect(groupEl.classList.contains('flex-col')).toBeTrue();
    });
  });

  describe('SngResizablePanel', () => {
    it('should render panels', () => {
      fixture.detectChanges();
      const panels = fixture.nativeElement.querySelectorAll('sng-resizable-panel');
      expect(panels.length).toBe(2);
    });

    it('should render panel content', () => {
      fixture.detectChanges();
      const panel1 = fixture.nativeElement.querySelector('.panel-1');
      const panel2 = fixture.nativeElement.querySelector('.panel-2');
      expect(panel1).toBeTruthy();
      expect(panel2).toBeTruthy();
    });
  });

  describe('SngResizableHandle', () => {
    it('should render handle', () => {
      fixture.detectChanges();
      const handle = fixture.nativeElement.querySelector('sng-resizable-handle');
      expect(handle).toBeTruthy();
    });
  });

  describe('Panel sizes', () => {
    it('should initialize panel sizes', () => {
      fixture.detectChanges();
      const sizes = host.resizableGroup._panelSizes();
      expect(sizes.length).toBe(2);
      expect(sizes[0]).toBe(30);
      expect(sizes[1]).toBe(70);
    });
  });

  describe('Class input', () => {
    it('should apply custom classes', () => {
      host.groupClass = 'border rounded-lg';
      fixture.detectChanges();
      groupEl = fixture.nativeElement.querySelector('sng-resizable-group');
      expect(groupEl.classList.contains('border')).toBeTrue();
      expect(groupEl.classList.contains('rounded-lg')).toBeTrue();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { SngPopover } from './sng-popover';
import { SngPopoverTrigger } from './sng-popover-trigger';
import { SngPopoverContent } from './sng-popover-content';

@Component({
  standalone: true,
  imports: [SngPopover, SngPopoverTrigger, SngPopoverContent],
  template: `
    <sng-popover [side]="side" [class]="customClass">
      <sng-popover-trigger>Open</sng-popover-trigger>
      <sng-popover-content>
        <div>Popover content</div>
      </sng-popover-content>
    </sng-popover>
  `,
})
class TestHostComponent {
  side: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  customClass = 'w-80';
}

describe('SngPopover', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let popover: HTMLElement;
  let trigger: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, OverlayModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    popover = fixture.nativeElement.querySelector('sng-popover');
    trigger = fixture.nativeElement.querySelector('sng-popover-trigger');
  });

  afterEach(() => {
    const overlays = document.querySelectorAll('.cdk-overlay-container *');
    overlays.forEach(el => el.remove());
  });

  it('should create', () => {
    expect(popover).toBeTruthy();
    expect(trigger).toBeTruthy();
  });

  it('should be closed by default', () => {
    const component = fixture.debugElement.children[0].componentInstance;
    expect(component.isOpen()).toBeFalse();
  });

  it('should open on trigger click', () => {
    trigger.click();
    fixture.detectChanges();

    const component = fixture.debugElement.children[0].componentInstance;
    expect(component.isOpen()).toBeTrue();
  });

  it('should close on second trigger click', () => {
    jasmine.clock().install();
    try {
      trigger.click();
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();

      // Wait for close animation (150ms)
      jasmine.clock().tick(200);

      const component = fixture.debugElement.children[0].componentInstance;
      expect(component.isOpen()).toBeFalse();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('should show content when open', () => {
    trigger.click();
    fixture.detectChanges();

    const content = document.querySelector('.cdk-overlay-pane');
    expect(content).toBeTruthy();
  });

  it('should apply custom class', () => {
    expect(popover.classList.contains('w-80')).toBeTrue();
  });

  it('should have aria-haspopup on trigger', () => {
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('should set aria-expanded when open', () => {
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should set data-state on trigger', () => {
    expect(trigger.getAttribute('data-state')).toBe('closed');

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('data-state')).toBe('open');
  });

  it('should configure close scroll strategy and side fallback positions', () => {
    const overlay = TestBed.inject(Overlay);
    const closeSpy = spyOn(overlay.scrollStrategies, 'close').and.callThrough();
    const createSpy = spyOn(overlay, 'create').and.callThrough();

    const localFixture = TestBed.createComponent(TestHostComponent);
    localFixture.componentInstance.side = 'left';
    localFixture.detectChanges();
    const localTrigger = localFixture.nativeElement.querySelector('sng-popover-trigger') as HTMLElement;
    localTrigger.click();
    localFixture.detectChanges();

    expect(closeSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();

    const overlayConfig = createSpy.calls.mostRecent().args[0] as { positionStrategy: unknown };
    const strategy = overlayConfig.positionStrategy as {
      _preferredPositions: { originX: string; originY: string; overlayX: string; overlayY: string; offsetX?: number }[];
      _canPush: boolean;
      _viewportMargin: number;
    };

    expect(strategy._canPush).toBeTrue();
    expect(strategy._viewportMargin).toBe(8);
    expect(strategy._preferredPositions.length).toBe(2);
    expect(strategy._preferredPositions[0].originX).toBe('start');
    expect(strategy._preferredPositions[0].overlayX).toBe('end');
    expect(strategy._preferredPositions[0].offsetX).toBe(-4);
    expect(strategy._preferredPositions[1].originX).toBe('end');
    expect(strategy._preferredPositions[1].overlayX).toBe('start');
    expect(strategy._preferredPositions[1].offsetX).toBe(4);

    localFixture.destroy();
  });

  it('should keep primary position first then opposite-side fallback', () => {
    const overlay = TestBed.inject(Overlay);
    const createSpy = spyOn(overlay, 'create').and.callThrough();

    const localFixture = TestBed.createComponent(TestHostComponent);
    localFixture.componentInstance.side = 'top';
    localFixture.detectChanges();
    const localTrigger = localFixture.nativeElement.querySelector('sng-popover-trigger') as HTMLElement;
    localTrigger.click();
    localFixture.detectChanges();

    const overlayConfig = createSpy.calls.mostRecent().args[0] as { positionStrategy: unknown };
    const strategy = overlayConfig.positionStrategy as {
      _preferredPositions: { originY: string; overlayY: string; offsetY?: number }[];
    };

    expect(strategy._preferredPositions.length).toBe(2);
    expect(strategy._preferredPositions[0].originY).toBe('top');
    expect(strategy._preferredPositions[0].overlayY).toBe('bottom');
    expect(strategy._preferredPositions[0].offsetY).toBe(-4);
    expect(strategy._preferredPositions[1].originY).toBe('bottom');
    expect(strategy._preferredPositions[1].overlayY).toBe('top');
    expect(strategy._preferredPositions[1].offsetY).toBe(4);

    localFixture.destroy();
  });
});

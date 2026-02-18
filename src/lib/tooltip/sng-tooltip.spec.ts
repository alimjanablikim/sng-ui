import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { SngTooltip } from './sng-tooltip';

@Component({
  standalone: true,
  imports: [SngTooltip],
  template: `
    <button
      [sngTooltip]="tooltipText"
      [sngTooltipPosition]="position"
      [sngTooltipClass]="customClass"
    >
      Hover me
    </button>
  `,
})
class TestHostComponent {
  tooltipText = 'Tooltip text';
  position: 'top' | 'bottom' | 'left' | 'right' = 'top';
  customClass = 'bg-red-500';
}

describe('SngTooltip', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let _host: TestHostComponent;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, OverlayModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    _host = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  afterEach(() => {
    // Clean up any overlays
    const overlays = document.querySelectorAll('.cdk-overlay-container sng-tooltip-content');
    overlays.forEach(el => el.remove());
  });

  it('should create', () => {
    expect(button).toBeTruthy();
  });

  it('should show tooltip on mouseenter', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const tooltip = document.querySelector('sng-tooltip-content');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toContain('Tooltip text');
  });

  it('should hide tooltip on mouseleave', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    button.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    const tooltip = document.querySelector('sng-tooltip-content');
    expect(tooltip?.getAttribute('data-state')).toBe('closed');
  });

  it('should show tooltip on focus', () => {
    button.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    const tooltip = document.querySelector('sng-tooltip-content');
    expect(tooltip).toBeTruthy();
  });

  it('should hide tooltip on blur', () => {
    button.dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();

    button.dispatchEvent(new FocusEvent('blur'));
    fixture.detectChanges();

    const tooltip = document.querySelector('sng-tooltip-content');
    expect(tooltip?.getAttribute('data-state')).toBe('closed');
  });

  it('should have role="tooltip"', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const tooltip = document.querySelector('sng-tooltip-content');
    expect(tooltip?.getAttribute('role')).toBe('tooltip');
  });

  it('should apply custom class', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const tooltip = document.querySelector('sng-tooltip-content');
    expect(tooltip?.classList.contains('bg-red-500')).toBeTrue();
  });

  it('should configure close scroll strategy with side fallback and viewport push', () => {
    const overlay = TestBed.inject(Overlay);
    const closeSpy = spyOn(overlay.scrollStrategies, 'close').and.callThrough();
    const createSpy = spyOn(overlay, 'create').and.callThrough();

    const localFixture = TestBed.createComponent(TestHostComponent);
    localFixture.componentInstance.position = 'left';
    localFixture.detectChanges();
    const localButton = localFixture.nativeElement.querySelector('button') as HTMLButtonElement;
    localButton.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    localFixture.detectChanges();

    expect(closeSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();

    const overlayConfig = createSpy.calls.mostRecent().args[0] as { positionStrategy: unknown };
    const strategy = overlayConfig.positionStrategy as {
      _preferredPositions: { originX: string; overlayX: string; offsetX?: number }[];
      _canPush: boolean;
      _viewportMargin: number;
    };

    expect(strategy._canPush).toBeTrue();
    expect(strategy._viewportMargin).toBe(8);
    expect(strategy._preferredPositions.length).toBe(2);
    expect(strategy._preferredPositions[0].originX).toBe('start');
    expect(strategy._preferredPositions[0].overlayX).toBe('end');
    expect(strategy._preferredPositions[0].offsetX).toBe(-8);
    expect(strategy._preferredPositions[1].originX).toBe('end');
    expect(strategy._preferredPositions[1].overlayX).toBe('start');
    expect(strategy._preferredPositions[1].offsetX).toBe(8);

    localFixture.destroy();
  });
});

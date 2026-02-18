import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, ViewChild } from '@angular/core';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { SngHoverCard, HoverCardSide } from './sng-hover-card';
import { SngHoverCardTrigger } from './sng-hover-card-trigger';
import { SngHoverCardContent } from './sng-hover-card-content';

@Component({
  standalone: true,
  imports: [SngHoverCard, SngHoverCardTrigger, SngHoverCardContent],
  template: `
    <sng-hover-card [side]="side" [openDelay]="openDelay" [closeDelay]="closeDelay">
      <sng-hover-card-trigger>
        <span class="trigger">Hover me</span>
      </sng-hover-card-trigger>
      <sng-hover-card-content>
        <div class="card-content">Card content here</div>
      </sng-hover-card-content>
    </sng-hover-card>
  `,
})
class TestHostComponent {
  @ViewChild(SngHoverCard) hoverCard!: SngHoverCard;
  side: HoverCardSide = 'bottom';
  openDelay = 200;
  closeDelay = 300;
}

describe('SngHoverCard', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, OverlayModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  afterEach(() => {
    const overlays = document.querySelectorAll('.cdk-overlay-container *');
    overlays.forEach(el => el.remove());
  });

  describe('Basic functionality', () => {
    it('should create', () => {
      fixture.detectChanges();
      const hoverCard = fixture.nativeElement.querySelector('sng-hover-card');
      expect(hoverCard).toBeTruthy();
    });

    it('should render trigger', () => {
      fixture.detectChanges();
      const trigger = fixture.nativeElement.querySelector('.trigger');
      expect(trigger).toBeTruthy();
      expect(trigger.textContent).toBe('Hover me');
    });

    it('should be closed by default', () => {
      fixture.detectChanges();
      expect(host.hoverCard.isOpen()).toBeFalse();
    });
  });

  describe('Side positioning', () => {
    it('should default to bottom', () => {
      fixture.detectChanges();
      expect(host.hoverCard.side()).toBe('bottom');
    });

    it('should accept top side', () => {
      host.side = 'top';
      fixture.detectChanges();
      expect(host.hoverCard.side()).toBe('top');
    });

    it('should accept left side', () => {
      host.side = 'left';
      fixture.detectChanges();
      expect(host.hoverCard.side()).toBe('left');
    });

    it('should accept right side', () => {
      host.side = 'right';
      fixture.detectChanges();
      expect(host.hoverCard.side()).toBe('right');
    });
  });

  describe('Delay configuration', () => {
    it('should have configurable open delay', () => {
      host.openDelay = 500;
      fixture.detectChanges();
      expect(host.hoverCard.openDelay()).toBe(500);
    });

    it('should have configurable close delay', () => {
      host.closeDelay = 100;
      fixture.detectChanges();
      expect(host.hoverCard.closeDelay()).toBe(100);
    });
  });

  describe('Opening and closing', () => {
    it('should track open state', () => {
      fixture.detectChanges();
      expect(host.hoverCard.isOpen()).toBeFalse();
    });

    it('should have hide method', () => {
      fixture.detectChanges();
      expect(typeof host.hoverCard.hide).toBe('function');
    });

    it('should not open on focus events', () => {
      jasmine.clock().install();
      try {
        host.openDelay = 0;
        fixture.detectChanges();

        const trigger = fixture.nativeElement.querySelector('sng-hover-card-trigger') as HTMLElement;
        trigger.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
        fixture.detectChanges();
        jasmine.clock().tick(20);

        expect(host.hoverCard.isOpen()).toBeFalse();
      } finally {
        jasmine.clock().uninstall();
      }
    });
  });

  describe('Overlay positioning contract', () => {
    function openHoverCard(): void {
      const trigger = fixture.nativeElement.querySelector('sng-hover-card-trigger') as HTMLElement;
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      fixture.detectChanges();
      jasmine.clock().tick(1);
      fixture.detectChanges();
    }

    it('should use close scroll strategy with viewport push and fallback positions', () => {
      jasmine.clock().install();
      try {
        host.side = 'right';
        host.openDelay = 0;
        fixture.detectChanges();

        const overlay = TestBed.inject(Overlay);
        const closeSpy = spyOn(overlay.scrollStrategies, 'close').and.callThrough();
        const createSpy = spyOn(overlay, 'create').and.callThrough();

        openHoverCard();

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
        expect(strategy._preferredPositions[0].originX).toBe('end');
        expect(strategy._preferredPositions[0].overlayX).toBe('start');
        expect(strategy._preferredPositions[0].offsetX).toBe(4);
        expect(strategy._preferredPositions[1].originX).toBe('start');
        expect(strategy._preferredPositions[1].overlayX).toBe('end');
        expect(strategy._preferredPositions[1].offsetX).toBe(-4);
      } finally {
        jasmine.clock().uninstall();
      }
    });
  });
});

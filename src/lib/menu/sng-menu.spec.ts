import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, viewChild } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { SngMenu } from './sng-menu';
import { SngMenuTrigger } from './sng-menu-trigger';
import { SngMenuItem } from './sng-menu-item';
import { SngMenuSeparator } from './sng-menu-separator';
import { SngMenuLabel } from './sng-menu-label';
import { SngMenuSub } from './sng-menu-sub';
import { SngMenuSubTrigger } from './sng-menu-sub-trigger';
import { SngMenuSubContent } from './sng-menu-sub-content';
import { SngContextTrigger } from './sng-context-trigger';

@Component({
  standalone: true,
  imports: [SngMenu, SngMenuTrigger, SngMenuItem, SngMenuSeparator, SngMenuLabel],
  template: `
    <button [sngMenuTrigger]="menu" [side]="side" [align]="align">Open Menu</button>
    <sng-menu #menu>
      <sng-menu-label>My Account</sng-menu-label>
      <sng-menu-separator />
      <sng-menu-item (click)="onProfile()">Profile</sng-menu-item>
      <sng-menu-item (click)="onSettings()">Settings</sng-menu-item>
    </sng-menu>
  `,
})
class TestHostComponent {
  side: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  align: 'start' | 'center' | 'end' = 'start';

  profileClicked = false;
  settingsClicked = false;

  onProfile() {
    this.profileClicked = true;
  }

  onSettings() {
    this.settingsClicked = true;
  }
}

describe('SngMenu', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
  });

  it('should create', () => {
    fixture.detectChanges();
    const menu = fixture.nativeElement.querySelector('sng-menu');
    expect(menu).toBeTruthy();
  });

  it('should have trigger button', () => {
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger).toBeTruthy();
    expect(trigger.textContent).toContain('Open Menu');
  });

  it('should have aria-haspopup on trigger', () => {
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
  });

  it('should have aria-expanded false initially', () => {
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should have data-state closed initially', () => {
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button');
    expect(trigger.getAttribute('data-state')).toBe('closed');
  });
});

@Component({
  standalone: true,
  imports: [SngMenu, SngContextTrigger, SngMenuItem],
  template: `
    <div class="context-zone" [sngContextTrigger]="menu">Context Zone</div>
    <sng-menu #menu>
      <sng-menu-item>Open</sng-menu-item>
    </sng-menu>
  `,
})
class ContextMenuHostComponent {}

describe('SngMenu overlay contract', () => {
  it('should focus first interactive item when trigger menu opens', () => {
    jasmine.clock().install();
    try {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      trigger.click();
      fixture.detectChanges();
      jasmine.clock().tick(0);

      const active = document.activeElement as HTMLElement | null;
      expect(active?.tagName.toLowerCase()).toBe('sng-menu-item');
      expect(active?.textContent).toContain('Profile');

      fixture.destroy();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('should focus first interactive item when context menu opens', () => {
    jasmine.clock().install();
    try {
      TestBed.configureTestingModule({
        imports: [ContextMenuHostComponent],
        providers: [provideZonelessChangeDetection()],
      });
      const fixture = TestBed.createComponent(ContextMenuHostComponent);
      fixture.detectChanges();

      const zone = fixture.nativeElement.querySelector('.context-zone') as HTMLElement;
      zone.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 100, clientY: 120 }));
      fixture.detectChanges();
      jasmine.clock().tick(0);

      const active = document.activeElement as HTMLElement | null;
      expect(active?.tagName.toLowerCase()).toBe('sng-menu-item');
      expect(active?.textContent).toContain('Open');

      fixture.destroy();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('should focus submenu trigger when root menu starts with submenu content', () => {
    jasmine.clock().install();
    try {
      TestBed.configureTestingModule({
        imports: [SubMenuTestHost],
        providers: [provideZonelessChangeDetection()],
      });
      const fixture = TestBed.createComponent(SubMenuTestHost);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      trigger.click();
      fixture.detectChanges();
      jasmine.clock().tick(0);

      const active = document.activeElement as HTMLElement | null;
      expect(active?.tagName.toLowerCase()).toBe('sng-menu-sub-trigger');
      expect(active?.getAttribute('role')).toBe('menuitem');

      fixture.destroy();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('should use reposition strategy with push and viewport margin for trigger menu', () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    const host = fixture.componentInstance;
    const overlay = TestBed.inject(Overlay);
    const repositionSpy = spyOn(overlay.scrollStrategies, 'reposition').and.callThrough();
    const createSpy = spyOn(overlay, 'create').and.callThrough();

    host.side = 'right';
    host.align = 'end';
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(repositionSpy).toHaveBeenCalled();
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
    expect(strategy._preferredPositions[0].originX).toBe('end');
    expect(strategy._preferredPositions[0].overlayX).toBe('start');
    expect(strategy._preferredPositions[0].originY).toBe('bottom');
    expect(strategy._preferredPositions[0].overlayY).toBe('bottom');
    expect(strategy._preferredPositions[0].offsetX).toBe(4);
    expect(strategy._preferredPositions[1].originX).toBe('start');
    expect(strategy._preferredPositions[1].overlayX).toBe('end');
    expect(strategy._preferredPositions[1].originY).toBe('bottom');
    expect(strategy._preferredPositions[1].overlayY).toBe('bottom');
    expect(strategy._preferredPositions[1].offsetX).toBe(-4);

    fixture.destroy();
  });

  it('should block outside wheel scroll while open and restore on close', async () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const blockedEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true });
    document.body.dispatchEvent(blockedEvent);
    expect(blockedEvent.defaultPrevented).toBeTrue();

    const overlayPane = document.querySelector('.cdk-overlay-pane') as HTMLElement | null;
    trigger.click();
    fixture.detectChanges();

    if (overlayPane) {
      const animations = overlayPane.getAnimations({ subtree: true });
      await Promise.allSettled(animations.map(animation => animation.finished));
    }
    await Promise.resolve();
    fixture.detectChanges();

    const restoredEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true });
    document.body.dispatchEvent(restoredEvent);
    expect(restoredEvent.defaultPrevented).toBeFalse();

    fixture.destroy();
  });

  it('should use point-based context menu positions with close scroll strategy', () => {
    TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
      providers: [provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(ContextMenuHostComponent);
    const overlay = TestBed.inject(Overlay);
    const closeSpy = spyOn(overlay.scrollStrategies, 'close').and.callThrough();
    const createSpy = spyOn(overlay, 'create').and.callThrough();
    fixture.detectChanges();

    const zone = fixture.nativeElement.querySelector('.context-zone') as HTMLElement;
    zone.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 100, clientY: 120 }));
    fixture.detectChanges();

    expect(closeSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();

    const overlayConfig = createSpy.calls.mostRecent().args[0] as { positionStrategy: unknown };
    const strategy = overlayConfig.positionStrategy as {
      _preferredPositions: { originX: string; originY: string; overlayX: string; overlayY: string }[];
      _canPush: boolean;
      _viewportMargin: number;
    };

    expect(strategy._canPush).toBeTrue();
    expect(strategy._viewportMargin).toBe(8);
    expect(strategy._preferredPositions.length).toBe(4);
    expect(strategy._preferredPositions[0].originX).toBe('start');
    expect(strategy._preferredPositions[0].originY).toBe('bottom');
    expect(strategy._preferredPositions[0].overlayX).toBe('start');
    expect(strategy._preferredPositions[0].overlayY).toBe('top');

    fixture.destroy();
  });

  it('should ignore invalid context-menu coordinates', () => {
    TestBed.configureTestingModule({
      imports: [ContextMenuHostComponent],
      providers: [provideZonelessChangeDetection()],
    });
    const fixture = TestBed.createComponent(ContextMenuHostComponent);
    const overlay = TestBed.inject(Overlay);
    const createSpy = spyOn(overlay, 'create').and.callThrough();
    fixture.detectChanges();

    const zone = fixture.nativeElement.querySelector('.context-zone') as HTMLElement;
    zone.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: -1, clientY: 20 }));
    fixture.detectChanges();

    expect(createSpy).not.toHaveBeenCalled();
    expect(document.querySelector('.cdk-overlay-pane')).toBeFalsy();

    fixture.destroy();
  });
});

describe('SngMenuSub overlay contract', () => {
  it('should focus first interactive item when submenu opens', () => {
    jasmine.clock().install();
    try {
      TestBed.configureTestingModule({
        imports: [SubMenuTestHost],
        providers: [provideZonelessChangeDetection()],
      });
      const fixture = TestBed.createComponent(SubMenuTestHost);
      fixture.detectChanges();

      const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
      trigger.click();
      fixture.detectChanges();
      jasmine.clock().tick(0);

      const submenuHost = document.querySelector('sng-menu-sub') as HTMLElement;
      submenuHost.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      fixture.detectChanges();
      jasmine.clock().tick(130);

      const active = document.activeElement as HTMLElement | null;
      expect(active?.tagName.toLowerCase()).toBe('sng-menu-item');
      expect(active?.textContent).toContain('Email');

      fixture.destroy();
    } finally {
      jasmine.clock().uninstall();
    }
  });
});

// ── SngMenuSub hover behavior ────────────────────────────────────────

@Component({
  standalone: true,
  imports: [
    SngMenu, SngMenuTrigger, SngMenuItem,
    SngMenuSub, SngMenuSubTrigger, SngMenuSubContent,
  ],
  template: `
    <button [sngMenuTrigger]="menu">Open</button>
    <sng-menu #menu>
      <sng-menu-sub>
        <sng-menu-sub-trigger>Share</sng-menu-sub-trigger>
        <sng-menu-sub-content>
          <sng-menu-item>Email</sng-menu-item>
        </sng-menu-sub-content>
      </sng-menu-sub>
    </sng-menu>
  `,
})
class SubMenuTestHost {
  sub = viewChild.required(SngMenuSub);
}

describe('SngMenuSub.onMouseLeave', () => {
  let fixture: ComponentFixture<SubMenuTestHost>;
  let sub: SngMenuSub;

  beforeEach(async () => {
    jasmine.clock().install();

    await TestBed.configureTestingModule({
      imports: [SubMenuTestHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SubMenuTestHost);
    fixture.detectChanges();
    sub = fixture.componentInstance.sub();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    fixture.destroy();
  });

  function makeMouseLeaveEvent(relatedTarget: Element | null): MouseEvent {
    return new MouseEvent('mouseleave', { relatedTarget, bubbles: true });
  }

  it('should skip close when relatedTarget is inside .sng-menu-sub-panel', () => {
    sub.isOpen.set(true);

    const panel = document.createElement('div');
    panel.classList.add('sng-menu-sub-panel');
    const item = document.createElement('sng-menu-item');
    panel.appendChild(item);
    document.body.appendChild(panel);

    sub.onMouseLeave(makeMouseLeaveEvent(item));

    jasmine.clock().tick(200);
    expect(sub.isOpen()).toBe(true);

    document.body.removeChild(panel);
  });

  it('should schedule close when relatedTarget is outside any panel', () => {
    sub.isOpen.set(true);

    const outside = document.createElement('div');
    document.body.appendChild(outside);

    sub.onMouseLeave(makeMouseLeaveEvent(outside));

    jasmine.clock().tick(200);
    expect(sub.isOpen()).toBe(false);

    document.body.removeChild(outside);
  });

  it('should schedule close when relatedTarget is null', () => {
    sub.isOpen.set(true);

    sub.onMouseLeave(makeMouseLeaveEvent(null));

    jasmine.clock().tick(200);
    expect(sub.isOpen()).toBe(false);
  });

  it('should skip close when relatedTarget is inside a nested (deeper) submenu panel', () => {
    sub.isOpen.set(true);

    // Deeper panel that is not a direct child
    const deepPanel = document.createElement('div');
    deepPanel.classList.add('sng-menu-sub-panel');
    const nested = document.createElement('div');
    deepPanel.appendChild(nested);
    document.body.appendChild(deepPanel);

    sub.onMouseLeave(makeMouseLeaveEvent(nested));

    jasmine.clock().tick(200);
    expect(sub.isOpen()).toBe(true);

    document.body.removeChild(deepPanel);
  });

  it('should cancel pending close when scheduleOpen is called', () => {
    sub.isOpen.set(true);

    const outside = document.createElement('div');
    document.body.appendChild(outside);

    // Schedule a close
    sub.onMouseLeave(makeMouseLeaveEvent(outside));

    // Before timeout fires, cancel via scheduleOpen (simulates mouseenter on overlay)
    sub.scheduleOpen();

    jasmine.clock().tick(200);
    expect(sub.isOpen()).toBe(true);

    document.body.removeChild(outside);
  });
});

// ── Overlay leave handler logic ──────────────────────────────────────

describe('Overlay _hoverLeaveHandler logic', () => {
  // Tests the leave handler algorithm used by SngMenuSubContent:
  //   1. Skip if relatedTarget is back in the parent sng-menu-sub
  //   2. Skip if relatedTarget is inside any .sng-menu-sub-panel
  //   3. Otherwise call scheduleClose

  function shouldSkipClose(related: Element | null, parentHostEl: Element): boolean {
    if (related?.closest('sng-menu-sub') === parentHostEl) return true;
    if (related?.closest('.sng-menu-sub-panel')) return true;
    return false;
  }

  let parentHost: HTMLElement;
  let deepPanel: HTMLElement;
  let outside: HTMLElement;

  beforeEach(() => {
    parentHost = document.createElement('sng-menu-sub');
    document.body.appendChild(parentHost);

    deepPanel = document.createElement('div');
    deepPanel.classList.add('sng-menu-sub-panel');
    document.body.appendChild(deepPanel);

    outside = document.createElement('div');
    document.body.appendChild(outside);
  });

  afterEach(() => {
    document.body.removeChild(parentHost);
    document.body.removeChild(deepPanel);
    document.body.removeChild(outside);
  });

  it('should skip close when mouse returns to parent sng-menu-sub', () => {
    const trigger = document.createElement('sng-menu-sub-trigger');
    parentHost.appendChild(trigger);

    expect(shouldSkipClose(trigger, parentHost)).toBe(true);
  });

  it('should skip close when mouse moves to a deeper submenu panel', () => {
    const deepItem = document.createElement('sng-menu-item');
    deepPanel.appendChild(deepItem);

    expect(shouldSkipClose(deepItem, parentHost)).toBe(true);
  });

  it('should NOT skip close when mouse moves outside', () => {
    expect(shouldSkipClose(outside, parentHost)).toBe(false);
  });

  it('should NOT skip close when relatedTarget is null', () => {
    expect(shouldSkipClose(null, parentHost)).toBe(false);
  });

  it('should skip close when mouse moves to a sibling element inside the deeper panel', () => {
    const wrapper = document.createElement('div');
    deepPanel.appendChild(wrapper);
    const child = document.createElement('span');
    wrapper.appendChild(child);

    expect(shouldSkipClose(child, parentHost)).toBe(true);
  });
});

// ── SngMenuSub._reset() ─────────────────────────────────────────────

describe('SngMenuSub._reset()', () => {
  let fixture: ComponentFixture<SubMenuTestHost>;
  let sub: SngMenuSub;

  beforeEach(async () => {
    jasmine.clock().install();

    await TestBed.configureTestingModule({
      imports: [SubMenuTestHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SubMenuTestHost);
    fixture.detectChanges();
    sub = fixture.componentInstance.sub();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    fixture.destroy();
  });

  it('should set isOpen to false', () => {
    sub.isOpen.set(true);
    sub._reset();
    expect(sub.isOpen()).toBe(false);
  });

  it('should cancel pending open timeout', () => {
    sub.scheduleOpen();
    sub._reset();
    jasmine.clock().tick(200);
    expect(sub.isOpen()).toBe(false);
  });

  it('should cancel pending close timeout', () => {
    sub.isOpen.set(true);
    sub.scheduleClose();
    sub._reset();
    // isOpen was already set to false by _reset, verify close timer doesn't cause issues
    jasmine.clock().tick(200);
    expect(sub.isOpen()).toBe(false);
  });

  it('should allow reopening after reset', () => {
    sub.isOpen.set(true);
    sub._reset();
    expect(sub.isOpen()).toBe(false);
    sub.open();
    expect(sub.isOpen()).toBe(true);
  });
});

// ── Ancestor chain keep-open ─────────────────────────────────────────

describe('Ancestor chain keep-open', () => {
  // Tests that scheduleOpen on a descendant cancels pending close on all ancestors.
  // This prevents parent panels from closing when mouse crosses the gap between overlay panes.

  let fixture: ComponentFixture<SubMenuTestHost>;
  let sub: SngMenuSub;

  beforeEach(async () => {
    jasmine.clock().install();

    await TestBed.configureTestingModule({
      imports: [SubMenuTestHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SubMenuTestHost);
    fixture.detectChanges();
    sub = fixture.componentInstance.sub();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    fixture.destroy();
  });

  it('scheduleOpen should cancel a pending scheduleClose on same sub', () => {
    sub.isOpen.set(true);
    sub.scheduleClose(); // 100ms timer to close
    sub.scheduleOpen();  // should cancel close timer

    jasmine.clock().tick(200);
    expect(sub.isOpen()).toBe(true);
  });

  it('should keep sub open when descendant overlay enters within close delay', () => {
    sub.isOpen.set(true);

    // Simulate: mouse leaves overlay → scheduleClose
    sub.scheduleClose();

    // Within 100ms, mouse enters descendant overlay → scheduleOpen cancels close
    jasmine.clock().tick(50);
    sub.scheduleOpen();

    jasmine.clock().tick(200);
    expect(sub.isOpen()).toBe(true);
  });
});

// ── Cascade close via _contentDispose ────────────────────────────────

describe('Cascade close via _contentDispose', () => {
  let fixture: ComponentFixture<SubMenuTestHost>;
  let sub: SngMenuSub;

  beforeEach(async () => {
    jasmine.clock().install();

    await TestBed.configureTestingModule({
      imports: [SubMenuTestHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SubMenuTestHost);
    fixture.detectChanges();
    sub = fixture.componentInstance.sub();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    fixture.destroy();
  });

  it('should call _contentDispose when set and invoked', () => {
    let disposed = false;
    sub._contentDispose = () => { disposed = true; };

    sub._contentDispose?.();
    expect(disposed).toBe(true);
  });

  it('_contentDispose callback should be clearable', () => {
    let callCount = 0;
    sub._contentDispose = () => { callCount++; };
    sub._contentDispose?.();
    expect(callCount).toBe(1);

    sub._contentDispose = null;
    // After nulling, optional chaining should not call
    expect(sub._contentDispose).toBeNull();
  });

  it('_reset should not trigger _contentDispose', () => {
    sub.isOpen.set(true);

    let disposed = false;
    sub._contentDispose = () => { disposed = true; };

    sub._reset();
    expect(sub.isOpen()).toBe(false);
    expect(disposed).toBe(false);
  });

  it('closeImmediate should not trigger _contentDispose', () => {
    sub.isOpen.set(true);

    let disposed = false;
    sub._contentDispose = () => { disposed = true; };

    sub.closeImmediate();
    expect(sub.isOpen()).toBe(false);
    expect(disposed).toBe(false); // closeImmediate only sets isOpen, caller is responsible for cascade
  });
});

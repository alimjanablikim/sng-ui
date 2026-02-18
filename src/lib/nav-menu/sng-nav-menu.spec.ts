import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { SngNavMenu } from './sng-nav-menu';
import { SngNavMenuList } from './sng-nav-menu-list';
import { SngNavMenuItem } from './sng-nav-menu-item';
import { SngNavMenuTrigger } from './sng-nav-menu-trigger';
import { SngNavMenuContent } from './sng-nav-menu-content';
import { SngNavMenuLink } from './sng-nav-menu-link';

@Component({
  standalone: true,
  imports: [SngNavMenu, SngNavMenuList, SngNavMenuItem, SngNavMenuTrigger, SngNavMenuContent, SngNavMenuLink],
  template: `
    <sng-nav-menu [layout]="layout()" [hover]="hover()" [align]="align()" [side]="side()">
      <sng-nav-menu-list>
        <sng-nav-menu-item>
          <sng-nav-menu-trigger>Item 1</sng-nav-menu-trigger>
          <sng-nav-menu-content>
            <div class="panel-1">
              <a sngNavMenuLink href="#">Link 1</a>
            </div>
          </sng-nav-menu-content>
        </sng-nav-menu-item>
        <sng-nav-menu-item>
          <sng-nav-menu-trigger>Item 2</sng-nav-menu-trigger>
          <sng-nav-menu-content>
            <div class="panel-2">
              <a sngNavMenuLink href="#">Link 2</a>
            </div>
          </sng-nav-menu-content>
        </sng-nav-menu-item>
      </sng-nav-menu-list>
    </sng-nav-menu>
  `,
})
class TestHostComponent {
  layout = signal<'horizontal' | 'vertical'>('horizontal');
  hover = signal(true);
  align = signal<'item' | 'full'>('full');
  side = signal<'bottom' | 'top' | 'left' | 'right' | undefined>(undefined);
}

describe('SngNavMenu', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getItems(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('sng-nav-menu-item'));
  }

  function getTriggers(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('sng-nav-menu-trigger button'));
  }

  function getPanel(index: number): HTMLElement | null {
    return fixture.nativeElement.querySelector(`.panel-${index + 1}`);
  }

  function mouseEnter(el: HTMLElement): void {
    el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
    fixture.detectChanges();
  }

  function mouseLeave(el: HTMLElement): void {
    el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false }));
    fixture.detectChanges();
  }

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
    expect(fixture.nativeElement.querySelector('sng-nav-menu')).toBeTruthy();
  });

  it('should expose trigger semantics and reflect open state via aria-expanded', () => {
    const triggers = getTriggers();
    expect(triggers[0].tagName).toBe('BUTTON');
    expect(triggers[0].getAttribute('type')).toBe('button');
    expect(triggers[0].getAttribute('aria-haspopup')).toBe('menu');
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');

    triggers[0].click();
    fixture.detectChanges();

    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');
  });

  it('should open panel on hover', () => {
    const items = getItems();
    mouseEnter(items[0]);
    expect(getPanel(0)).toBeTruthy();
  });

  it('should close panel on mouseleave after delay', () => {
    jasmine.clock().install();
    try {
      const items = getItems();
      mouseEnter(items[0]);
      expect(getPanel(0)).toBeTruthy();

      mouseLeave(items[0]);
      // Panel should still be visible during the delay
      expect(getPanel(0)).toBeTruthy();

      jasmine.clock().tick(200);
      fixture.detectChanges();
      expect(getPanel(0)).toBeFalsy();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('should cancel close when re-entering item within delay', () => {
    jasmine.clock().install();
    try {
      const items = getItems();
      mouseEnter(items[0]);
      expect(getPanel(0)).toBeTruthy();

      mouseLeave(items[0]);
      jasmine.clock().tick(30);

      // Re-enter before delay expires
      mouseEnter(items[0]);
      jasmine.clock().tick(200);
      fixture.detectChanges();

      // Panel should still be open
      expect(getPanel(0)).toBeTruthy();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('should switch panels on hover between items', () => {
    jasmine.clock().install();
    try {
      const items = getItems();
      mouseEnter(items[0]);
      expect(getPanel(0)).toBeTruthy();
      expect(getPanel(1)).toBeFalsy();

      // Hover second item
      mouseEnter(items[1]);
      fixture.detectChanges();
      expect(getPanel(1)).toBeTruthy();
      expect(getPanel(0)).toBeFalsy();

      jasmine.clock().tick(200);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('should open on click when hover is disabled', async () => {
    host.hover.set(false);
    await fixture.whenStable();
    fixture.detectChanges();

    const triggers = getTriggers();
    triggers[0].click();
    fixture.detectChanges();
    expect(getPanel(0)).toBeTruthy();
  });

  it('should not open on hover when hover is disabled', async () => {
    host.hover.set(false);
    await fixture.whenStable();
    fixture.detectChanges();

    const items = getItems();
    mouseEnter(items[0]);
    expect(getPanel(0)).toBeFalsy();
  });

  describe('vertical layout with hover + align full', () => {
    beforeEach(async () => {
      host.layout.set('vertical');
      host.hover.set(true);
      host.align.set('full');
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should open panel on hover in vertical mode', () => {
      const items = getItems();
      mouseEnter(items[0]);
      expect(getPanel(0)).toBeTruthy();
    });

    it('should keep panel open during mouseleave delay', () => {
      jasmine.clock().install();
      try {
        const items = getItems();
        mouseEnter(items[0]);
        expect(getPanel(0)).toBeTruthy();

        mouseLeave(items[0]);
        // Still open immediately after leave
        expect(getPanel(0)).toBeTruthy();

        jasmine.clock().tick(50);
        fixture.detectChanges();
        // Still open at 50ms (delay is 100ms)
        expect(getPanel(0)).toBeTruthy();

        jasmine.clock().tick(100);
        fixture.detectChanges();
        // Closed after full delay
        expect(getPanel(0)).toBeFalsy();
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('should keep panel open when mouse re-enters item within delay (simulates gap crossing)', () => {
      jasmine.clock().install();
      try {
        const items = getItems();

        // Hover item to open panel
        mouseEnter(items[0]);
        expect(getPanel(0)).toBeTruthy();

        // Mouse leaves item (crossing gap to panel)
        mouseLeave(items[0]);
        jasmine.clock().tick(30);

        // Mouse enters item again (via panel child, simulating entering the content area)
        mouseEnter(items[0]);
        jasmine.clock().tick(200);
        fixture.detectChanges();

        // Panel remains open
        expect(getPanel(0)).toBeTruthy();
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('should not keep both panels open simultaneously via hover', () => {
      jasmine.clock().install();
      try {
        const items = getItems();

        // Hover first item
        mouseEnter(items[0]);
        expect(getPanel(0)).toBeTruthy();

        // Move to second item
        mouseLeave(items[0]);
        mouseEnter(items[1]);
        fixture.detectChanges();

        // Second panel open, first closed (openItem replaces)
        expect(getPanel(1)).toBeTruthy();
        expect(getPanel(0)).toBeFalsy();

        jasmine.clock().tick(200);
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('should apply correct side for vertical layout', () => {
      const items = getItems();
      mouseEnter(items[0]);

      const panel = fixture.nativeElement.querySelector('.sng-nav-menu-panel');
      expect(panel).toBeTruthy();
      // Default vertical side is 'right', panel should have left-full class
      expect(panel.classList.contains('left-full')).toBeTrue();
    });

    it('should work with side=left', async () => {
      host.side.set('left');
      await fixture.whenStable();
      fixture.detectChanges();

      const items = getItems();
      mouseEnter(items[0]);

      const panel = fixture.nativeElement.querySelector('.sng-nav-menu-panel');
      expect(panel).toBeTruthy();
      expect(panel.classList.contains('right-full')).toBeTrue();
    });
  });

  describe('resolved side positioning contract', () => {
    it('should default to bottom in horizontal layout', () => {
      host.layout.set('horizontal');
      host.side.set(undefined);
      fixture.detectChanges();

      const items = getItems();
      mouseEnter(items[0]);

      const panel = fixture.nativeElement.querySelector('.sng-nav-menu-panel');
      expect(panel.classList.contains('top-full')).toBeTrue();
    });

    it('should render panel above trigger for side=top', async () => {
      host.layout.set('horizontal');
      host.side.set('top');
      await fixture.whenStable();
      fixture.detectChanges();

      const items = getItems();
      mouseEnter(items[0]);

      const panel = fixture.nativeElement.querySelector('.sng-nav-menu-panel');
      expect(panel.classList.contains('bottom-full')).toBeTrue();
      expect(panel.classList.contains('mb-1.5')).toBeTrue();
    });
  });

  describe('toggle via click', () => {
    it('should toggle panel on click', () => {
      const triggers = getTriggers();
      triggers[0].click();
      fixture.detectChanges();
      expect(getPanel(0)).toBeTruthy();

      triggers[0].click();
      fixture.detectChanges();
      expect(getPanel(0)).toBeFalsy();
    });

    it('should close on document click outside', () => {
      const triggers = getTriggers();
      triggers[0].click();
      fixture.detectChanges();
      expect(getPanel(0)).toBeTruthy();

      document.body.click();
      fixture.detectChanges();
      expect(getPanel(0)).toBeFalsy();
    });
  });
});

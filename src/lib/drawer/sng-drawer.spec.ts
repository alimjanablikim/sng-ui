import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, ViewChild, TemplateRef } from '@angular/core';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { SngDrawer } from './sng-drawer';
import { SngDrawerContent } from './sng-drawer-content';
import { SngDrawerHeader } from './sng-drawer-header';
import { SngDrawerTitle } from './sng-drawer-title';
import { SngDrawerDescription } from './sng-drawer-description';
import { SngDrawerClose } from './sng-drawer-close';
import { SngDrawerWrapper } from './sng-drawer-wrapper';
import { SngButton } from '../button/sng-button';

@Component({
  standalone: true,
  imports: [
    SngDrawer,
    SngDrawerContent,
    SngDrawerHeader,
    SngDrawerTitle,
    SngDrawerDescription,
    SngDrawerClose,
    SngDrawerWrapper,
    SngButton,
  ],
  template: `
    <sng-drawer-wrapper class="app-wrapper" />
    <sng-drawer [side]="side" [shouldScaleBackground]="shouldScaleBackground" [modal]="modal">
      <sng-button (click)="openDrawer()">Open Drawer</sng-button>
      <ng-template #drawerContent>
        <sng-drawer-content>
          <sng-drawer-header>
            <sng-drawer-title>Drawer Title</sng-drawer-title>
            <sng-drawer-description>Drawer description</sng-drawer-description>
          </sng-drawer-header>
          <div class="drawer-body">Content here</div>
          <sng-drawer-close>
            <sng-button id="close-btn">Close</sng-button>
          </sng-drawer-close>
        </sng-drawer-content>
      </ng-template>
    </sng-drawer>
  `,
})
class TestHostComponent {
  @ViewChild(SngDrawer) drawer!: SngDrawer;
  @ViewChild('drawerContent') drawerContent!: TemplateRef<unknown>;
  side: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  shouldScaleBackground = true;
  modal = false;

  openDrawer() {
    this.drawer.open(this.drawerContent);
  }
}

describe('SngDrawer', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let triggerButton: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, OverlayModule, A11yModule],
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
      expect(host.drawer).toBeTruthy();
    });

    it('should be closed by default', () => {
      fixture.detectChanges();
      expect(host.drawer.isOpen()).toBeFalse();
    });

    it('should open when trigger is clicked', () => {
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      expect(host.drawer.isOpen()).toBeTrue();
    });

    it('should show content when open', () => {
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const content = document.querySelector('sng-drawer-content');
      expect(content).toBeTruthy();
    });

    it('should render drawer title', () => {
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const title = document.querySelector('sng-drawer-title');
      expect(title?.textContent).toContain('Drawer Title');
    });

    it('should render drawer description', () => {
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const desc = document.querySelector('sng-drawer-description');
      expect(desc?.textContent).toContain('Drawer description');
    });

    it('should keep sng-drawer-close as element-only selector', () => {
      const selectors = (SngDrawerClose as { ɵdir?: { selectors?: string[][] } }).ɵdir?.selectors ?? [];
      expect(selectors).toEqual([['sng-drawer-close']]);
    });
  });

  describe('Side', () => {
    it('should default to bottom', () => {
      expect(host.side).toBe('bottom');
    });

    it('should support top side', () => {
      host.side = 'top';
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const content = document.querySelector('sng-drawer-content');
      expect(content).toBeTruthy();
    });

    it('should support left side', () => {
      host.side = 'left';
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const content = document.querySelector('sng-drawer-content');
      expect(content).toBeTruthy();
    });

    it('should support right side', () => {
      host.side = 'right';
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const content = document.querySelector('sng-drawer-content');
      expect(content).toBeTruthy();
    });
  });

  describe('Closing', () => {
    it('should close when close button is clicked', () => {
      jasmine.clock().install();
      try {
        fixture.detectChanges();
        triggerButton = fixture.nativeElement.querySelector('button');
        triggerButton.click();
        fixture.detectChanges();

        const closeButton = document.querySelector('#close-btn') as HTMLElement;
        closeButton?.click();
        jasmine.clock().tick(600);

        expect(host.drawer.isOpen()).toBeFalse();
      } finally {
        jasmine.clock().uninstall();
      }
    });

  });

  describe('Background behavior', () => {
    it('should scale wrapper background when open in non-modal mode', () => {
      fixture.detectChanges();
      host.modal = false;
      host.shouldScaleBackground = true;
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector('sng-drawer-wrapper') as HTMLElement;
      expect(wrapper.style.transform).toContain('scale(0.95)');
      expect(document.body.style.backgroundColor).toBe('black');
    });

    it('should reset wrapper background styles after close', () => {
      jasmine.clock().install();
      try {
        fixture.detectChanges();
        host.modal = false;
        host.shouldScaleBackground = true;
        triggerButton = fixture.nativeElement.querySelector('button');
        triggerButton.click();
        fixture.detectChanges();

        host.drawer.close();
        fixture.detectChanges();
        jasmine.clock().tick(350);

        const wrapper = fixture.nativeElement.querySelector('sng-drawer-wrapper') as HTMLElement;
        expect(wrapper.style.transform).toBe('');
        expect(wrapper.style.borderRadius).toBe('');
        expect(document.body.style.backgroundColor).toBe('');
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('should not scale wrapper in modal mode', () => {
      document.body.style.backgroundColor = '';
      host.modal = true;
      host.shouldScaleBackground = true;
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector('sng-drawer-wrapper') as HTMLElement;
      expect(wrapper.style.transform).toBe('');
      expect(document.body.style.backgroundColor).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog" on content', () => {
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const content = document.querySelector('sng-drawer-content');
      expect(content?.getAttribute('role')).toBe('dialog');
    });

    it('should have aria-modal="true"', () => {
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const content = document.querySelector('sng-drawer-content');
      expect(content?.getAttribute('aria-modal')).toBe('true');
    });
  });

  describe('Overlay config contract', () => {
    it('should use block scroll strategy and drawer panel class', () => {
      fixture.detectChanges();
      const overlay = TestBed.inject(Overlay);
      const blockSpy = spyOn(overlay.scrollStrategies, 'block').and.callThrough();
      const createSpy = spyOn(overlay, 'create').and.callThrough();
      triggerButton = fixture.nativeElement.querySelector('button');

      triggerButton.click();
      fixture.detectChanges();

      expect(blockSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalled();
      const config = createSpy.calls.mostRecent().args[0] as { panelClass: string | string[] };
      const classes = Array.isArray(config.panelClass) ? config.panelClass : [config.panelClass];
      expect(classes).toContain('sng-drawer-panel');
    });
  });
});

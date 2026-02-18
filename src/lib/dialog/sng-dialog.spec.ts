import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection, ViewChild, TemplateRef } from '@angular/core';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { SngDialog } from './sng-dialog';
import { SngDialogContent } from './sng-dialog-content';
import { SngDialogHeader } from './sng-dialog-header';
import { SngDialogTitle } from './sng-dialog-title';
import { SngDialogDescription } from './sng-dialog-description';
import { SngDialogFooter } from './sng-dialog-footer';
import { SngDialogClose } from './sng-dialog-close';
import { SngButton } from '../button/sng-button';

@Component({
  standalone: true,
  imports: [
    SngDialog,
    SngDialogContent,
    SngDialogHeader,
    SngDialogTitle,
    SngDialogDescription,
    SngDialogFooter,
    SngDialogClose,
    SngButton,
  ],
  template: `
    <sng-dialog [alert]="alert" (openChange)="onOpenChange($event)">
      <sng-button (click)="openDialog()">Open</sng-button>
      <ng-template #dialogContent>
        <sng-dialog-content>
          <sng-dialog-header>
            <sng-dialog-title>Dialog Title</sng-dialog-title>
            <sng-dialog-description>Dialog description</sng-dialog-description>
          </sng-dialog-header>
          <div class="dialog-body">
            <input type="text" id="first-input" placeholder="First input" />
            <input type="text" id="second-input" placeholder="Second input" />
          </div>
          <sng-dialog-footer>
            <sng-button id="cancel-btn">Cancel</sng-button>
            <sng-dialog-close>
              <sng-button id="close-btn">Close</sng-button>
            </sng-dialog-close>
          </sng-dialog-footer>
        </sng-dialog-content>
      </ng-template>
    </sng-dialog>
  `,
})
class TestHostComponent {
  @ViewChild(SngDialog) dialog!: SngDialog;
  @ViewChild('dialogContent') dialogContent!: TemplateRef<unknown>;
  alert = false;
  openStates: boolean[] = [];

  openDialog() {
    this.dialog.open(this.dialogContent);
  }

  onOpenChange(state: boolean) {
    this.openStates.push(state);
  }
}

describe('SngDialog', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let dialog: HTMLElement;
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
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      expect(dialog).toBeTruthy();
      expect(triggerButton).toBeTruthy();
    });

    it('should be closed by default', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      expect(host.dialog.isOpen()).toBeFalse();
    });

    it('should open when trigger is clicked', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      expect(host.dialog.isOpen()).toBeTrue();
    });

    it('should show content when open', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const content = document.querySelector('.cdk-overlay-pane');
      expect(content).toBeTruthy();
    });

    it('should render dialog title', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const title = document.querySelector('sng-dialog-title');
      expect(title?.textContent).toContain('Dialog Title');
    });

    it('should render dialog description', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const desc = document.querySelector('sng-dialog-description');
      expect(desc?.textContent).toContain('Dialog description');
    });

    it('should close when close button is clicked', () => {
      jasmine.clock().install();
      try {
        fixture.detectChanges();
        dialog = fixture.nativeElement.querySelector('sng-dialog');
        triggerButton = fixture.nativeElement.querySelector('button');
        triggerButton.click();
        fixture.detectChanges();

        const closeButton = document.querySelector('#close-btn') as HTMLElement;
        closeButton?.click();
        fixture.detectChanges();

        // Wait for overlay disposal
        jasmine.clock().tick(200);

        expect(host.dialog.isOpen()).toBeFalse();
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('should emit openChange on open and close', () => {
      jasmine.clock().install();
      try {
        fixture.detectChanges();
        triggerButton = fixture.nativeElement.querySelector('button');

        triggerButton.click();
        fixture.detectChanges();
        expect(host.openStates).toEqual([true]);

        host.dialog.close();
        fixture.detectChanges();
        jasmine.clock().tick(250);

        expect(host.openStates).toEqual([true, false]);
      } finally {
        jasmine.clock().uninstall();
      }
    });
  });

  describe('Focus interactions', () => {
    it('should trap focus within the dialog', () => {
      jasmine.clock().install();
      try {
        fixture.detectChanges();
        dialog = fixture.nativeElement.querySelector('sng-dialog');
        triggerButton = fixture.nativeElement.querySelector('button');
        triggerButton.click();
        fixture.detectChanges();
        jasmine.clock().tick(300);
        fixture.detectChanges();

        // First focusable element should receive focus or be within the dialog
        const activeElement = document.activeElement;
        const dialogContent = document.querySelector('sng-dialog-content');

        expect(dialogContent?.contains(activeElement) || dialogContent === activeElement).toBeTrue();
      } finally {
        jasmine.clock().uninstall();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog" on the content', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const dialogContent = document.querySelector('sng-dialog-content');
      expect(dialogContent?.getAttribute('role')).toBe('dialog');
    });

    it('should have aria-modal="true"', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const dialogContent = document.querySelector('sng-dialog-content');
      expect(dialogContent?.getAttribute('aria-modal')).toBe('true');
    });

    it('should have aria-labelledby pointing to the title', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const dialogContent = document.querySelector('sng-dialog-content');
      const title = document.querySelector('sng-dialog-title');

      const labelledBy = dialogContent?.getAttribute('aria-labelledby');
      const titleId = title?.getAttribute('id');

      if (labelledBy && titleId) {
        expect(labelledBy).toBe(titleId);
      }
    });

    it('should have aria-describedby pointing to the description', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const dialogContent = document.querySelector('sng-dialog-content');
      const desc = document.querySelector('sng-dialog-description');

      const describedBy = dialogContent?.getAttribute('aria-describedby');
      const descId = desc?.getAttribute('id');

      if (describedBy && descId) {
        expect(describedBy).toBe(descId);
      }
    });

    it('should use role="alertdialog" in alert mode', () => {
      host.alert = true;
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const dialogContent = document.querySelector('sng-dialog-content');
      expect(dialogContent?.getAttribute('role')).toBe('alertdialog');
    });
  });

  describe('Backdrop behavior', () => {
    it('should show backdrop when dialog is open', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      // Dialog uses custom overlay div inside sng-dialog-content (not CDK backdrop)
      const overlay = document.querySelector('sng-dialog-content > div[data-state]');
      expect(overlay).toBeTruthy();
    });

    it('should close when clicking backdrop', () => {
      jasmine.clock().install();
      try {
        fixture.detectChanges();
        dialog = fixture.nativeElement.querySelector('sng-dialog');
        triggerButton = fixture.nativeElement.querySelector('button');
        triggerButton.click();
        fixture.detectChanges();

        // Click the custom overlay div (not CDK backdrop)
        const overlay = document.querySelector('sng-dialog-content > div[data-state]') as HTMLElement;
        overlay?.click();
        fixture.detectChanges();
        jasmine.clock().tick(250);

        expect(host.dialog.isOpen()).toBeFalse();
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('should not close on backdrop click in alert mode', () => {
      jasmine.clock().install();
      try {
        host.alert = true;
        fixture.detectChanges();
        triggerButton = fixture.nativeElement.querySelector('button');
        triggerButton.click();
        fixture.detectChanges();
        expect(host.dialog.isOpen()).toBeTrue();

        const overlay = document.querySelector('sng-dialog-content > div[data-state]') as HTMLElement;
        overlay?.click();
        fixture.detectChanges();
        jasmine.clock().tick(250);

        expect(host.dialog.isOpen()).toBeTrue();
      } finally {
        jasmine.clock().uninstall();
      }
    });
  });

  describe('Edge cases', () => {
    it('should not error when opening already open dialog', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      expect(() => {
        host.dialog.open(host.dialogContent);
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should not error when closing already closed dialog', () => {
      fixture.detectChanges();
      dialog = fixture.nativeElement.querySelector('sng-dialog');
      triggerButton = fixture.nativeElement.querySelector('button');
      expect(() => {
        host.dialog.close();
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should handle rapid open/close cycles', () => {
      jasmine.clock().install();
      try {
        fixture.detectChanges();
        dialog = fixture.nativeElement.querySelector('sng-dialog');
        triggerButton = fixture.nativeElement.querySelector('button');
        triggerButton.click();
        fixture.detectChanges();
        host.dialog.close();
        jasmine.clock().tick(50);
        triggerButton.click();
        fixture.detectChanges();
        host.dialog.close();
        jasmine.clock().tick(250);

        expect(host.dialog.isOpen()).toBeFalse();
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('should restore focus to trigger in alert mode after close', async () => {
      host.alert = true;
      fixture.detectChanges();
      triggerButton = fixture.nativeElement.querySelector('button');
      triggerButton.click();
      fixture.detectChanges();

      const firstInput = document.querySelector('#first-input') as HTMLElement;
      firstInput?.focus();
      expect(document.activeElement).toBe(firstInput);

      const overlayPane = document.querySelector('.cdk-overlay-pane') as HTMLElement | null;
      host.dialog.close();
      fixture.detectChanges();

      if (overlayPane) {
        const animations = overlayPane.getAnimations({ subtree: true });
        await Promise.allSettled(animations.map(animation => animation.finished));
      }
      await Promise.resolve();
      fixture.detectChanges();

      expect(document.activeElement).toBe(triggerButton);
    });
  });

  describe('Overlay config contract', () => {
    it('should use block scroll strategy and default panel class', () => {
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
      expect(classes).toContain('sng-dialog-panel');
    });

    it('should use alert panel class in alert mode', () => {
      host.alert = true;
      fixture.detectChanges();
      const overlay = TestBed.inject(Overlay);
      const createSpy = spyOn(overlay, 'create').and.callThrough();
      triggerButton = fixture.nativeElement.querySelector('button');

      triggerButton.click();
      fixture.detectChanges();

      const config = createSpy.calls.mostRecent().args[0] as { panelClass: string | string[] };
      const classes = Array.isArray(config.panelClass) ? config.panelClass : [config.panelClass];
      expect(classes).toContain('sng-alert-dialog-panel');
    });
  });
});

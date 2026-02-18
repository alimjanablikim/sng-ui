import {
  Directive,
  inject,
  Injector,
  input,
  OnDestroy,
  ViewContainerRef,
  afterNextRender,
} from '@angular/core';
import { Overlay, type OverlayRef, type ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { SngMenu } from './sng-menu';
import { animateOverlayClose, focusMenuContent } from './sng-menu-tokens';

const CONTEXT_MENU_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
  { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
];

/**
 * Directive that opens a menu on right-click (context menu).
 * Owns the CDK Overlay lifecycle for point-based positioning.
 *
 * @example
 * ```html
 * <div [sngContextTrigger]="myMenu" class="w-full h-64 border">
 *   Right click anywhere in this area
 * </div>
 * <sng-menu #myMenu>...</sng-menu>
 * ```
 */
@Directive({
  selector: '[sngContextTrigger]',
  standalone: true,
  host: {
    '[attr.data-state]': 'menu()?.isOpen() ? "open" : "closed"',
    '(contextmenu)': 'onContextMenu($event)',
  },
})
export class SngContextTrigger implements OnDestroy {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private viewContainerRef = inject(ViewContainerRef);

  private overlayRef: OverlayRef | null = null;
  private _closing = false;

  /** The menu to open when right-clicked. */
  menu = input.required<SngMenu>({ alias: 'sngContextTrigger' });

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.openAt(event.clientX, event.clientY);
  }

  ngOnDestroy() {
    this.close();
    this.disposeOverlay();
  }

  private openAt(x: number, y: number) {
    const menuRef = this.menu();
    if (!menuRef) return;

    this.disposeOverlay();

    const template = menuRef._menuTemplate();
    if (!template) return;

    if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0) return;

    menuRef.currentSide.set('bottom');
    menuRef._closeFromTrigger = () => this.close();

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions(CONTEXT_MENU_POSITIONS)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.detachments().subscribe(() => this.close());

    const portal = new TemplatePortal(template, this.viewContainerRef);
    this.overlayRef.attach(portal);

    menuRef.isOpen.set(true);

    afterNextRender(() => {
      const panel = this.overlayRef?.overlayElement.querySelector('[role="menu"]') as HTMLElement | null;
      if (panel) {
        focusMenuContent(panel);
      }
    }, { injector: this.injector });
  }

  private close() {
    const menuRef = this.menu();
    if (!menuRef?.isOpen() || this._closing) return;
    this._closing = true;
    menuRef._subContentOverlays.forEach(sc => sc._resetOnMenuClose());
    menuRef.isOpen.set(false);

    if (this.overlayRef) {
      animateOverlayClose(this.overlayRef, () => this.disposeOverlay());
    } else {
      this._closing = false;
    }
  }

  private disposeOverlay() {
    this._closing = false;
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}

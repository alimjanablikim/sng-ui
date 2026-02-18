import {
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  afterNextRender,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CdkOverlayOrigin, Overlay, type OverlayRef, type ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { SngMenu } from './sng-menu';
import { animateOverlayClose, focusMenuContent } from './sng-menu-tokens';

type OverlaySide = 'top' | 'bottom' | 'left' | 'right';
type OverlayAlign = 'start' | 'center' | 'end';

const MENU_POSITIONS: Record<OverlaySide, ConnectedPosition[]> = {
  bottom: [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ],
  top: [
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  ],
  right: [
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
  ],
  left: [
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
  ],
};

function getMenuPositions(side: OverlaySide, align: OverlayAlign = 'start'): ConnectedPosition[] {
  const base = MENU_POSITIONS[side];
  const isHorizontalSide = side === 'left' || side === 'right';

  return base.map(pos => {
    if (isHorizontalSide) {
      const yAlign = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center';
      return { ...pos, originY: yAlign, overlayY: yAlign };
    } else {
      return { ...pos, originX: align, overlayX: align };
    }
  }) as ConnectedPosition[];
}

/**
 * Directive that opens a menu on click. Owns the CDK Overlay lifecycle.
 *
 * @example
 * ```html
 * <button [sngMenuTrigger]="myMenu">Open Menu</button>
 * <sng-menu #myMenu>...</sng-menu>
 * ```
 */
@Directive({
  selector: '[sngMenuTrigger]',
  standalone: true,
  hostDirectives: [CdkOverlayOrigin],
  host: {
    'data-sng-menu-trigger': '',
    '[attr.aria-haspopup]': '"menu"',
    '[attr.aria-expanded]': 'menu()?.isOpen()',
    '[attr.data-state]': 'menu()?.isOpen() ? "open" : "closed"',
    '(click)': 'onClick($event)',
  },
})
export class SngMenuTrigger implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private injector = inject(Injector);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private document = inject(DOCUMENT);

  private overlayRef: OverlayRef | null = null;
  private _closing = false;
  private _outsideClickHandler: ((e: PointerEvent) => void) | null = null;
  private _wheelHandler: ((e: WheelEvent) => void) | null = null;
  private _touchMoveHandler: ((e: TouchEvent) => void) | null = null;

  /** The menu to open when clicked. */
  menu = input.required<SngMenu>({ alias: 'sngMenuTrigger' });

  /** Which side of the trigger to position the menu. */
  side = input<OverlaySide>('bottom');

  /** Alignment of the menu relative to the trigger. */
  align = input<OverlayAlign>('start');

  /** Optional origin element for positioning. Positions the overlay relative to this element instead of the trigger. */
  origin = input<HTMLElement>();

  ngOnInit() {
    const menuRef = this.menu();
    if (menuRef) {
      menuRef._closeFromTrigger = () => this.close();
    }
  }

  ngOnDestroy() {
    this.disposeOverlay();
  }

  onClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggle();
  }

  /** Opens the menu. */
  open() {
    const menuRef = this.menu();
    if (!menuRef) return;

    this.disposeOverlay();

    const template = menuRef._menuTemplate();
    if (!template) return;

    const triggerElement = this.getPositionElement();
    const originElement = this.origin() || triggerElement;

    menuRef.currentSide.set(this.side());

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(originElement)
      .withPositions(getMenuPositions(this.side(), this.align()))
      .withPush(true)
      .withViewportMargin(8);

    const triggerWidth = triggerElement.getBoundingClientRect().width;

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      minWidth: triggerWidth,
    });

    this.overlayRef.detachments().subscribe(() => this.close());

    // Outside click detection (no backdrop — triggers remain interactive)
    // Use requestAnimationFrame to skip the current click event that opened the menu
    requestAnimationFrame(() => {
      this._outsideClickHandler = (e: PointerEvent) => {
        const target = e.target as HTMLElement;
        if (!this.overlayRef?.overlayElement.contains(target) &&
            !this.elementRef.nativeElement.contains(target) &&
            !target.closest('.sng-menu-sub-panel')) {
          this.close();
        }
      };
      this.document.addEventListener('pointerdown', this._outsideClickHandler);
    });

    // Block scroll outside the overlay (allow scroll inside submenu panels)
    this._wheelHandler = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (!this.overlayRef?.overlayElement.contains(target) &&
          !target.closest('.sng-menu-sub-panel')) {
        e.preventDefault();
      }
    };
    this.document.addEventListener('wheel', this._wheelHandler, { passive: false, capture: true });

    this._touchMoveHandler = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!this.overlayRef?.overlayElement.contains(target) &&
          !target.closest('.sng-menu-sub-panel')) {
        e.preventDefault();
      }
    };
    this.document.addEventListener('touchmove', this._touchMoveHandler, { passive: false, capture: true });

    const portal = new TemplatePortal(template, this.viewContainerRef);
    this.overlayRef.attach(portal);

    menuRef.isOpen.set(true);

    this.focusPanel();
  }

  /** Closes the menu with exit animation. */
  close() {
    const menuRef = this.menu();
    if (!menuRef?.isOpen() || this._closing) return;
    this._closing = true;

    // Reset sub state and dispose sub-content overlays before closing the root overlay
    menuRef._subContentOverlays.forEach(sc => sc._resetOnMenuClose());

    menuRef.isOpen.set(false);

    if (this.overlayRef) {
      animateOverlayClose(this.overlayRef, () => this.disposeOverlay());
    } else {
      this._closing = false;
    }
  }

  /** Toggles the menu open/closed state. */
  toggle() {
    if (this.menu()?.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Resolves the actual position element, handling display: contents wrappers like sng-button. */
  private getPositionElement(): HTMLElement {
    const el = this.elementRef.nativeElement;
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return el;

    const display = this.document.defaultView?.getComputedStyle(el).display;
    if (display === 'contents') {
      for (const child of Array.from(el.children)) {
        if (child instanceof HTMLElement) {
          const childRect = child.getBoundingClientRect();
          if (childRect.width > 0 && childRect.height > 0) return child;
        }
      }
    }
    return el;
  }

  private focusPanel() {
    afterNextRender(() => {
      const panel = this.overlayRef?.overlayElement.querySelector('[role="menu"]') as HTMLElement | null;
      if (panel) {
        focusMenuContent(panel);
      }
    }, { injector: this.injector });
  }

  private removeListeners() {
    if (this._outsideClickHandler) {
      this.document.removeEventListener('pointerdown', this._outsideClickHandler);
      this._outsideClickHandler = null;
    }
    if (this._wheelHandler) {
      this.document.removeEventListener('wheel', this._wheelHandler, { capture: true } as EventListenerOptions);
      this._wheelHandler = null;
    }
    if (this._touchMoveHandler) {
      this.document.removeEventListener('touchmove', this._touchMoveHandler, { capture: true } as EventListenerOptions);
      this._touchMoveHandler = null;
    }
  }

  private disposeOverlay() {
    this._closing = false;
    this.removeListeners();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}

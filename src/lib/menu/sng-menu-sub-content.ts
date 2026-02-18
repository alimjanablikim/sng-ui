import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  inject,
  Injector,
  effect,
  contentChildren,
  forwardRef,
  TemplateRef,
  viewChild,
  ViewContainerRef,
  OnDestroy,
  afterNextRender,
} from '@angular/core';
import { Overlay, type OverlayRef, type ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { cn } from './cn';
import { SNG_MENU_PANEL, type MenuPanel, animateOverlayClose, focusMenuContent } from './sng-menu-tokens';
import { SngMenu } from './sng-menu';
import { SngMenuSub, type MenuContentCoordinator } from './sng-menu-sub';

const SUB_POSITIONS: ConnectedPosition[] = [
  { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetX: 4 },
  { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -4 },
];

/**
 * Container for submenu items. Uses CDK Overlay for viewport-aware positioning.
 *
 * @example
 * ```html
 * <sng-menu-sub>
 *   <sng-menu-sub-trigger>More</sng-menu-sub-trigger>
 *   <sng-menu-sub-content>
 *     <sng-menu-item>Nested Item 1</sng-menu-item>
 *   </sng-menu-sub-content>
 * </sng-menu-sub>
 * ```
 */
@Component({
  selector: 'sng-menu-sub-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: SNG_MENU_PANEL, useExisting: SngMenuSubContent },
  ],
  styles: [`
    .sng-menu-sub-panel[data-state=open] { animation: sng-menu-sub-enter 150ms ease both; }
    .sng-menu-sub-panel[data-state=closed] { animation: sng-menu-sub-exit 150ms ease both; }
    @keyframes sng-menu-sub-enter { from { opacity: 0; transform: scale(0.95) translateX(-0.5rem); } }
    @keyframes sng-menu-sub-exit { to { opacity: 0; transform: scale(0.95); } }
  `],
  template: `
    <ng-template #subTemplate>
      <div
        [class]="contentClasses()"
        [attr.data-state]="parentSub.isOpen() ? 'open' : 'closed'"
        role="menu"
        tabindex="-1">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class SngMenuSubContent implements MenuPanel, MenuContentCoordinator, OnDestroy {
  /** @internal */
  parentSub = inject(SngMenuSub);
  private rootPanel = inject(SNG_MENU_PANEL, { skipSelf: true });
  private rootMenu = inject(SngMenu);
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private viewContainerRef = inject(ViewContainerRef);

  private subTemplate = viewChild<TemplateRef<unknown>>('subTemplate');
  private overlayRef: OverlayRef | null = null;
  private _closing = false;
  private _hoverEnterHandler: ((e: Event) => void) | null = null;
  private _hoverLeaveHandler: ((e: Event) => void) | null = null;

  /** @internal Track nested submenus for coordination. */
  private nestedSubs = contentChildren(forwardRef(() => SngMenuSub), { descendants: true });

  /** @internal Currently open nested submenu. */
  private openSubmenu: SngMenuSub | null = null;

  /** Custom CSS classes. */
  class = input<string>('');

  /** Inherits closeOnSelect from the root menu. */
  get closeOnSelect() { return this.rootPanel.closeOnSelect; }

  contentClasses = computed(() =>
    cn(
      'z-[9999] min-w-[8rem] rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-lg',
      'flex flex-col sng-menu-sub-panel',
      this.class()
    )
  );

  constructor() {
    // Register with root menu for synchronous cleanup on close
    this.rootMenu._subContentOverlays.add(this);

    // Register cascade-dispose callback so parent can synchronously tear us down
    this.parentSub._contentDispose = () => this._cascadeDispose();

    // Register as coordinator for nested submenus
    effect(() => {
      const subs = this.nestedSubs();
      subs.forEach(sub => { sub._parentCoordinator = this; });
    });

    // React to parent sub open/close
    effect(() => {
      const isOpen = this.parentSub.isOpen();
      if (isOpen) {
        this.openOverlay();
      } else {
        this.closeOverlay();
      }
    });
  }

  /** Close the entire menu tree. */
  close() {
    this.rootPanel.close();
  }

  /** @internal */
  _requestSubOpen(sub: SngMenuSub): void {
    if (this.openSubmenu && this.openSubmenu !== sub) {
      // Cascade-dispose any nested overlays synchronously before closing the sibling
      this.openSubmenu._contentDispose?.();
      this.openSubmenu.closeImmediate();
    }
    this.openSubmenu = sub;
  }

  /** @internal */
  _notifySubClosed(sub: SngMenuSub): void {
    if (this.openSubmenu === sub) {
      this.openSubmenu = null;
    }
  }

  /** @internal */
  _shouldOpenImmediately(sub: SngMenuSub): boolean {
    return this.openSubmenu !== null && this.openSubmenu !== sub;
  }

  /** @internal Reset all state when root menu closes. */
  _resetOnMenuClose() {
    this.parentSub._reset();
    if (this.openSubmenu) {
      this.openSubmenu._contentDispose?.();
      this.openSubmenu._reset();
      this.openSubmenu = null;
    }
    this._closing = false;
    this._disposeOverlay();
  }

  /** @internal Cancel pending close on this submenu and all ancestor submenus. */
  _keepAncestorChainOpen() {
    this.parentSub.scheduleOpen();
    const coord = this.parentSub._parentCoordinator;
    if (coord instanceof SngMenuSubContent) {
      coord._keepAncestorChainOpen();
    }
  }

  /** @internal Synchronously tear down this overlay and all nested child overlays. */
  _cascadeDispose() {
    // Cascade down: dispose any open nested submenu's overlay first
    if (this.openSubmenu) {
      this.openSubmenu._contentDispose?.();
      this.openSubmenu._reset();
      this.openSubmenu = null;
    }
    this._closing = false;
    this._disposeOverlay();
  }

  ngOnDestroy() {
    this.parentSub._contentDispose = null;
    this.rootMenu._subContentOverlays.delete(this);
    // Force-dispose: bypass _closing guard since the component is being destroyed
    this._closing = false;
    this._disposeOverlay();
  }

  private openOverlay() {
    const template = this.subTemplate();
    const triggerEl = this.parentSub._subTrigger()?._elementRef.nativeElement;
    if (!template || !triggerEl) return;

    this._disposeOverlay();

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(triggerEl)
      .withPositions(SUB_POSITIONS)
      .withPush(true)
      .withViewportMargin(8);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const portal = new TemplatePortal(template, this.viewContainerRef);
    this.overlayRef.attach(portal);

    // Keep submenu open when mouse is over the overlay panel
    const overlayEl = this.overlayRef.overlayElement;
    this._hoverEnterHandler = () => this._keepAncestorChainOpen();
    this._hoverLeaveHandler = (e: Event) => {
      const related = (e as MouseEvent).relatedTarget as HTMLElement | null;
      // If mouse went back to the parent sng-menu-sub, don't close
      if (related?.closest('sng-menu-sub') === this.parentSub._hostEl) return;
      // If mouse went to a deeper nested submenu panel, don't close
      if (related?.closest('.sng-menu-sub-panel')) return;
      this.parentSub.scheduleClose();
    };
    overlayEl.addEventListener('mouseenter', this._hoverEnterHandler);
    overlayEl.addEventListener('mouseleave', this._hoverLeaveHandler);

    afterNextRender(() => {
      const panel = this.overlayRef?.overlayElement.querySelector('[role="menu"]') as HTMLElement | null;
      if (panel) {
        focusMenuContent(panel);
      }
    }, { injector: this.injector });
  }

  private closeOverlay() {
    if (!this.overlayRef || this._closing) return;
    this._closing = true;
    // Synchronously cascade-close all nested overlays before animating this one
    if (this.openSubmenu) {
      this.openSubmenu._contentDispose?.();
      this.openSubmenu._reset();
      this.openSubmenu = null;
    }
    animateOverlayClose(this.overlayRef, () => this._disposeOverlay());
  }

  /** @internal */ _disposeOverlay() {
    this._closing = false;
    if (this.overlayRef) {
      const overlayEl = this.overlayRef.overlayElement;
      if (this._hoverEnterHandler) {
        overlayEl.removeEventListener('mouseenter', this._hoverEnterHandler);
        this._hoverEnterHandler = null;
      }
      if (this._hoverLeaveHandler) {
        overlayEl.removeEventListener('mouseleave', this._hoverLeaveHandler);
        this._hoverLeaveHandler = null;
      }
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}

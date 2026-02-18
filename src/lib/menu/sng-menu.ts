import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  computed,
  input,
  TemplateRef,
  viewChild,
  booleanAttribute,
} from '@angular/core';
import { SNG_MENU_PANEL, type MenuPanel } from './sng-menu-tokens';
import { cn } from './cn';

/**
 * Menu content container. Provides the template and lifecycle coordination.
 * Overlay lifecycle is owned by the trigger directive.
 *
 * @example
 * ```html
 * <button [sngMenuTrigger]="menu">Open</button>
 * <sng-menu #menu>
 *   <sng-menu-item>Edit</sng-menu-item>
 *   <sng-menu-item>Delete</sng-menu-item>
 * </sng-menu>
 * ```
 */
@Component({
  selector: 'sng-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: SNG_MENU_PANEL, useExisting: SngMenu },
  ],
  styles: [`
    .sng-menu-panel[data-state=open][data-side=bottom] { animation: sng-menu-enter-bottom var(--sng-menu-duration, 150ms) var(--sng-menu-ease, ease) both; }
    .sng-menu-panel[data-state=open][data-side=top] { animation: sng-menu-enter-top var(--sng-menu-duration, 150ms) var(--sng-menu-ease, ease) both; }
    .sng-menu-panel[data-state=open][data-side=left] { animation: sng-menu-enter-left var(--sng-menu-duration, 150ms) var(--sng-menu-ease, ease) both; }
    .sng-menu-panel[data-state=open][data-side=right] { animation: sng-menu-enter-right var(--sng-menu-duration, 150ms) var(--sng-menu-ease, ease) both; }
    .sng-menu-panel[data-state=closed] { animation: sng-menu-exit var(--sng-menu-duration, 150ms) var(--sng-menu-ease, ease) both; }
    @keyframes sng-menu-enter-bottom { from { opacity: 0; transform: scale(0.95) translateY(-0.5rem); } }
    @keyframes sng-menu-enter-top { from { opacity: 0; transform: scale(0.95) translateY(0.5rem); } }
    @keyframes sng-menu-enter-left { from { opacity: 0; transform: scale(0.95) translateX(0.5rem); } }
    @keyframes sng-menu-enter-right { from { opacity: 0; transform: scale(0.95) translateX(-0.5rem); } }
    @keyframes sng-menu-exit { to { opacity: 0; transform: scale(0.95); } }
  `],
  template: `
    <ng-template #menuTemplate>
      <div
        [class]="contentClasses()"
        [attr.data-state]="dataState()"
        [attr.data-side]="currentSide()"
        role="menu"
        tabindex="-1">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class SngMenu implements MenuPanel {
  /** @internal Template for menu content. */
  _menuTemplate = viewChild<TemplateRef<unknown>>('menuTemplate');

  /** @internal Registry of sub-content overlays for synchronous cleanup on close. */
  _subContentOverlays = new Set<{ _disposeOverlay(): void; _resetOnMenuClose(): void }>();

  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether items close the menu when selected. Individual items can override. */
  closeOnSelect = input(true, { transform: booleanAttribute });

  /** @internal Whether the menu is open (set by trigger). */
  isOpen = signal(false);

  /** @internal Current side for positioning (set by trigger). */
  currentSide = signal<'top' | 'bottom' | 'left' | 'right'>('bottom');

  /** @internal Close callback set by the trigger that owns the overlay. */
  _closeFromTrigger: (() => void) | null = null;

  dataState = computed(() => this.isOpen() ? 'open' : 'closed');

  contentClasses = computed(() =>
    cn(
      'z-[9999] min-w-[max(8rem,100%)] rounded-md border bg-popover text-popover-foreground py-1 shadow-md flex flex-col',
      'outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
      'sng-menu-panel',
      this.class()
    )
  );

  /** Close the menu. Resets sub state and disposes overlays, then delegates to the trigger. */
  close() {
    this._subContentOverlays.forEach(sc => sc._resetOnMenuClose());
    this._closeFromTrigger?.();
  }

}

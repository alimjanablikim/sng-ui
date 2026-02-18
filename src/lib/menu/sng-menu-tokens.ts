import { InjectionToken, type Signal } from '@angular/core';
import type { OverlayRef } from '@angular/cdk/overlay';

/** Interface for a menu panel that items can close. */
export interface MenuPanel {
  /** Close the menu. */
  close(): void;
  /** Whether items close the menu on select by default. */
  readonly closeOnSelect: Signal<boolean>;
}

/** @internal Token for the closest menu panel. */
export const SNG_MENU_PANEL = new InjectionToken<MenuPanel>('SngMenuPanel');

/** @internal Shared base classes for all interactive menu items. */
export const MENU_ITEM_BASE_CLASSES = [
  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
  'hover:bg-accent hover:text-accent-foreground',
  'focus-visible:bg-accent focus-visible:text-accent-foreground',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
] as const;

/** @internal Selector for all interactive menuitem roles. */
export const MENU_FOCUSABLE_SELECTOR = [
  '[role="menuitem"]:not([data-disabled])',
  '[role="menuitemcheckbox"]:not([data-disabled])',
  '[role="menuitemradio"]:not([data-disabled])',
].join(', ');

/** @internal Focuses first interactive item; falls back to panel for empty menus. */
export function focusMenuContent(panel: HTMLElement): void {
  const firstItem = panel.querySelector<HTMLElement>(MENU_FOCUSABLE_SELECTOR);
  (firstItem ?? panel).focus();
}

/** @internal Triggers exit animations on an overlay and calls disposeFn when complete. */
export function animateOverlayClose(overlayRef: OverlayRef, disposeFn: () => void): void {
  const panel = overlayRef.overlayElement;
  if (!panel) {
    disposeFn();
    return;
  }
  panel.querySelectorAll('[data-state]').forEach(el =>
    el.setAttribute('data-state', 'closed')
  );
  const animations = panel.getAnimations({ subtree: true });
  if (animations.length > 0) {
    Promise.allSettled(animations.map(animation => animation.finished)).finally(() => disposeFn());
  } else {
    disposeFn();
  }
}

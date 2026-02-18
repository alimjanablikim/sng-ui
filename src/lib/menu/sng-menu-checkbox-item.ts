import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  model,
  booleanAttribute,
  inject,
} from '@angular/core';
import { cn } from './cn';
import { SNG_MENU_PANEL, MENU_ITEM_BASE_CLASSES } from './sng-menu-tokens';

/**
 * A checkbox menu item that can be toggled on/off.
 *
 * @example
 * ```html
 * <sng-menu>
 *   <sng-menu-checkbox-item [(checked)]="showToolbar">
 *     Show Toolbar
 *   </sng-menu-checkbox-item>
 * </sng-menu>
 * ```
 */
@Component({
  selector: 'sng-menu-checkbox-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-state]': 'checked() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'resolvedDisabled() ? "" : null',
    '[attr.aria-checked]': 'checked()',
    '[attr.tabindex]': 'resolvedDisabled() ? -1 : 0',
    'role': 'menuitemcheckbox',
    '(click)': 'toggle()',
  },
  template: `
    <span class="flex h-4 w-4 items-center justify-center mr-2">
      @if (checked()) {
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      }
    </span>
    <ng-content />
  `,
})
export class SngMenuCheckboxItem {
  private panel = inject(SNG_MENU_PANEL, { optional: true });

  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether the checkbox is checked. Supports two-way binding. */
  checked = model(false);

  /** Whether the checkbox item is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Legacy disabled input name. */
  isDisabled = input<unknown>(undefined);

  /** Whether to close the menu when this item is toggled. Uses parent menu's setting when not specified. */
  isCloseOnSelect = input<boolean | undefined>(undefined);

  resolvedDisabled = computed(() => {
    const legacyValue = this.isDisabled();
    return legacyValue === undefined ? this.disabled() : booleanAttribute(legacyValue);
  });

  hostClasses = computed(() =>
    cn(
      ...MENU_ITEM_BASE_CLASSES,
      this.class()
    )
  );

  /** Toggles the checked state. */
  toggle() {
    if (!this.resolvedDisabled()) {
      this.checked.update(v => !v);
      const shouldClose = this.isCloseOnSelect() ?? this.panel?.closeOnSelect() ?? true;
      if (shouldClose) {
        this.panel?.close();
      }
    }
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';
import { SngMenuRadioGroup } from './sng-menu-radio-group';
import { SNG_MENU_PANEL, MENU_ITEM_BASE_CLASSES } from './sng-menu-tokens';

/**
 * A radio menu item within a radio group.
 *
 * @example
 * ```html
 * <sng-menu-radio-group [(value)]="theme">
 *   <sng-menu-radio-item value="light">Light</sng-menu-radio-item>
 *   <sng-menu-radio-item value="dark">Dark</sng-menu-radio-item>
 * </sng-menu-radio-group>
 * ```
 */
@Component({
  selector: 'sng-menu-radio-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-state]': 'isChecked() ? "checked" : "unchecked"',
    '[attr.data-disabled]': 'resolvedDisabled() ? "" : null',
    '[attr.aria-checked]': 'isChecked()',
    '[attr.tabindex]': 'resolvedDisabled() ? -1 : 0',
    'role': 'menuitemradio',
    '(click)': 'select()',
  },
  template: `
    <span class="flex h-4 w-4 items-center justify-center mr-2">
      @if (isChecked()) {
        <svg class="h-2 w-2 fill-current" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="4" />
        </svg>
      }
    </span>
    <ng-content />
  `,
})
export class SngMenuRadioItem {
  private radioGroup = inject(SngMenuRadioGroup, { optional: true });
  private panel = inject(SNG_MENU_PANEL, { optional: true });

  /** Custom CSS classes. */
  class = input<string>('');

  /** The value associated with this radio item. */
  value = input.required<string>();

  /** Whether the radio item is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Legacy disabled input name. */
  isDisabled = input<unknown>(undefined);

  /** Whether to close the menu when this item is selected. Uses parent menu's setting when not specified. */
  isCloseOnSelect = input<boolean | undefined>(undefined);

  resolvedDisabled = computed(() => {
    const legacyValue = this.isDisabled();
    return legacyValue === undefined ? this.disabled() : booleanAttribute(legacyValue);
  });

  /** Whether this item is currently checked. */
  isChecked = computed(() => this.radioGroup?.value() === this.value());

  hostClasses = computed(() =>
    cn(
      ...MENU_ITEM_BASE_CLASSES,
      this.class()
    )
  );

  /** Select this radio item. */
  select() {
    if (!this.resolvedDisabled() && this.radioGroup) {
      this.radioGroup._selectValue(this.value());
      const shouldClose = this.isCloseOnSelect() ?? this.panel?.closeOnSelect() ?? true;
      if (shouldClose) {
        this.panel?.close();
      }
    }
  }
}

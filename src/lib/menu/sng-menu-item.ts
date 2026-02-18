import {
  Directive,
  ElementRef,
  inject,
  input,
  computed,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';
import { SNG_MENU_PANEL, MENU_ITEM_BASE_CLASSES } from './sng-menu-tokens';

/**
 * A standard interactive menu item.
 *
 * @example
 * ```html
 * <sng-menu>
 *   <sng-menu-item>Edit</sng-menu-item>
 *   <sng-menu-item [isDisabled]="true">Delete</sng-menu-item>
 * </sng-menu>
 * ```
 */
@Directive({
  selector: 'sng-menu-item',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-disabled]': 'resolvedDisabled() ? "" : null',
    '[attr.tabindex]': 'resolvedDisabled() ? -1 : 0',
    'role': 'menuitem',
    '(click)': 'onClick()',
  },
})
export class SngMenuItem {
  private elementRef = inject(ElementRef);
  private panel = inject(SNG_MENU_PANEL, { optional: true });

  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether the menu item is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Legacy disabled input name. */
  isDisabled = input<unknown>(undefined);

  /** Whether to add left padding for alignment with checkbox/radio items. */
  inset = input(false, { transform: booleanAttribute });

  /** Whether to close the menu when this item is selected. Uses parent menu's setting when not specified. */
  isCloseOnSelect = input<boolean | undefined>(undefined);

  resolvedDisabled = computed(() => {
    const legacyValue = this.isDisabled();
    return legacyValue === undefined ? this.disabled() : booleanAttribute(legacyValue);
  });

  hostClasses = computed(() =>
    cn(
      ...MENU_ITEM_BASE_CLASSES,
      this.inset() && 'pl-8',
      this.class()
    )
  );

  /** CDK FocusableOption — focus this item. */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  onClick() {
    if (!this.resolvedDisabled()) {
      const shouldClose = this.isCloseOnSelect() ?? this.panel?.closeOnSelect() ?? true;
      if (shouldClose) {
        this.panel?.close();
      }
    }
  }

}

import {
  Component,
  input,
  computed,
  inject,
  forwardRef,
  ElementRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  OnDestroy,
} from '@angular/core';
import { SngSelect } from './sng-select';
import { cn } from './cn';

/**
 * Individual selectable item within a select dropdown.
 * Implements FocusableOption for focus behavior interoperability.
 *
 * @example
 * ```html
 * <sng-select [(value)]="selected">
 *   <sng-select-item value="apple">Apple</sng-select-item>
 *   <sng-select-item value="banana" [isDisabled]="true">Banana (unavailable)</sng-select-item>
 * </sng-select>
 * ```
 */
@Component({
  selector: 'sng-select-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'option',
    '[attr.aria-selected]': 'isSelected()',
    '[attr.aria-disabled]': 'resolvedDisabled()',
    '[attr.tabindex]': 'resolvedDisabled() ? -1 : 0',
    '[attr.data-state]': 'isSelected() ? "checked" : "unchecked"',
    '[class]': 'hostClasses()',
    '(click)': 'onSelect()',
  },
  template: `
    <ng-content />
    <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      @if (isSelected()) {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      }
    </span>
  `,
})
export class SngSelectItem implements OnDestroy {
  private parentSelect = inject(forwardRef(() => SngSelect));
  private elementRef = inject(ElementRef);
  private wasVisible = false;

  /** The value associated with this item, used for selection. */
  value = input<string>('');

  /** Whether this item is disabled and cannot be selected. */
  disabled = input(false, { transform: booleanAttribute });

  /** Legacy disabled input name. */
  isDisabled = input<unknown>(undefined);

  /** Custom CSS classes. */
  class = input<string>('');

  resolvedDisabled = computed(() => {
    const legacyValue = this.isDisabled();
    return legacyValue === undefined ? this.disabled() : booleanAttribute(legacyValue);
  });

  isSelected = computed(() => this.parentSelect.value() === this.value());

  isVisible = computed(() => {
    if (!this.parentSelect.searchable()) return true;
    const query = this.parentSelect.searchQuery().toLowerCase();
    if (!query) return true;
    const text = this._getTextContent().toLowerCase();
    return text.includes(query);
  });

  hostClasses = computed(() =>
    cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
      'text-sm py-1.5 pl-2 pr-8',
      this.resolvedDisabled() && 'pointer-events-none opacity-50',
      !this.isVisible() && 'hidden',
      this.class()
    )
  );

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  /** @internal */
  onSelect() {
    if (this.resolvedDisabled()) return;
    this.parentSelect._selectValue(this.value(), this._getTextContent());
  }

  constructor() {
    // Track visibility changes for searchable mode
    effect(() => {
      if (!this.parentSelect.searchable()) return;
      const visible = this.isVisible();
      if (visible && !this.wasVisible) {
        this.parentSelect._incrementVisibleCount();
      } else if (!visible && this.wasVisible) {
        this.parentSelect._decrementVisibleCount();
      }
      this.wasVisible = visible;
    });
  }

  ngOnDestroy() {
    if (this.wasVisible && this.parentSelect.searchable()) {
      this.parentSelect._decrementVisibleCount();
    }
  }

  /** @internal Returns the text content of this item for display in the trigger. */
  _getTextContent(): string {
    return this.elementRef.nativeElement.textContent?.trim() || '';
  }
}

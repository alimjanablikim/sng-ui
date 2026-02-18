import {
  Directive,
  input,
  computed,
  inject,
  effect,
  signal,
  ElementRef,
  OnInit,
  OnDestroy,
  booleanAttribute,
  output,
} from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { SNG_SEARCH_INPUT_CONTEXT } from './sng-search-input-context';
import { cn } from './cn';

/**
 * Individual selectable item within the search dropdown.
 * Supports filtering and disabled state.
 *
 * @example
 * ```html
 * <sng-search-input-list>
 *   <sng-search-input-item value="calendar" (selected)="openCalendar()">
 *     Calendar
 *     <sng-search-input-shortcut>New</sng-search-input-shortcut>
 *   </sng-search-input-item>
 *   <sng-search-input-item value="settings" [disabled]="true">Settings</sng-search-input-item>
 * </sng-search-input-list>
 * ```
 */
@Directive({
  selector: 'sng-search-input-item',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-visible]': 'isVisible()',
    '[attr.tabindex]': 'isDisabled ? -1 : 0',
    'role': 'option',
    '(click)': 'onSelect($event)',
  },
})
export class SngSearchInputItem implements OnInit, OnDestroy, FocusableOption {
  private searchContext = inject(SNG_SEARCH_INPUT_CONTEXT);
  private elementRef = inject(ElementRef);
  private wasVisible = false;

  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Value used for filtering. If not provided, text content is used.
   */
  value = input<string>('');

  /**
   * Whether the item is hidden by default and only shown when searched.
   */
  initiallyHidden = input(false, { transform: booleanAttribute });

  /**
   * Whether the item is disabled and cannot be selected.
   */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  protected _disabled = input(false, { transform: booleanAttribute, alias: 'disabled' });

  /**
   * Emitted when the item is selected.
   */
  selected = output<string>();

  /** Required by FocusableOption interface */
  get disabled(): boolean {
    return this._disabled();
  }

  /** @internal */
  get isDisabled(): boolean {
    return this._disabled();
  }

  isVisible = signal(false);

  constructor() {
    effect(() => {
      const query = this.searchContext.searchQuery().toLowerCase();
      const text = this.elementRef.nativeElement.textContent?.toLowerCase() || '';
      const itemValue = this.value().toLowerCase();
      const matches = text.includes(query) || itemValue.includes(query);
      const hidden = this.initiallyHidden();
      const isCommandMode = this.searchContext.command();
      const recentValues = this.searchContext.recentValues();
      const isRecent = recentValues.some(v => v.toLowerCase() === itemValue);

      let visible: boolean;
      if (query) {
        visible = matches;
      } else if (isRecent) {
        // Recent items always show when idle
        visible = true;
      } else if (isCommandMode) {
        // Command: show all non-hidden items by default
        visible = !hidden;
      } else {
        // Search: hide everything until user types
        visible = false;
      }
      this.updateVisibility(visible);
    });
  }

  private updateVisibility(visible: boolean) {
    this.isVisible.set(visible);

    if (visible !== this.wasVisible) {
      this.searchContext.updateVisibleCount(visible ? 1 : -1);
      this.wasVisible = visible;
    }
  }

  ngOnInit() {
    // Command: show non-hidden items. Search: hide all until typing.
    const hidden = this.initiallyHidden();
    const isCommandMode = this.searchContext.command();
    const visible = isCommandMode && !hidden;
    this.isVisible.set(visible);
    this.wasVisible = visible;

    if (visible) {
      this.searchContext.updateVisibleCount(1);
    }
  }

  ngOnDestroy() {
    if (this.wasVisible) {
      this.searchContext.updateVisibleCount(-1);
    }
  }

  hostClasses = computed(() =>
    cn(
      'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none',
      'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
      'data-[visible=false]:hidden',
      this._disabled() && 'pointer-events-none opacity-50',
      this.class()
    )
  );

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  onSelect(event: Event): void {
    if (this._disabled()) return;
    event.preventDefault();
    event.stopPropagation();
    const emitValue = this.value() || this.elementRef.nativeElement.textContent?.trim() || '';
    this.searchContext.trackSelection(emitValue);
    this.selected.emit(emitValue);
    this.searchContext.closeDropdown();
  }
}

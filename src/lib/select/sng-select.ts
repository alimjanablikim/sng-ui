import {
  Component,
  input,
  model,
  signal,
  computed,
  contentChildren,
  ElementRef,
  inject,
  Injector,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  effect,
  booleanAttribute,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SngSelectItem } from './sng-select-item';
import { cn } from './cn';

const TRANSITION_SHADOW = 'transition-[color,box-shadow] outline-none';
const FOCUS_RING = 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';
const SVG_BASE = '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4';
let nextSelectId = 0;

function createSelectListboxId(): string {
  nextSelectId += 1;
  return `sng-select-listbox-${nextSelectId}`;
}

/**
 * Root select component that provides a customizable dropdown selection interface.
 * Uses inline absolute positioning.
 *
 * @example
 * ```html
 * <sng-select [(value)]="selectedLanguage" placeholder="Select a language">
 *   <sng-select-item value="english"><span class="mr-2">🇬🇧</span>English</sng-select-item>
 *   <sng-select-item value="french"><span class="mr-2">🇫🇷</span>French</sng-select-item>
 * </sng-select>
 * ```
 */
@Component({
  selector: 'sng-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'relative block w-full',
    '(document:click)': 'onDocumentClick($event)',
  },
  styles: [`
    .sng-select-content[data-state=open] { animation: sng-select-enter var(--sng-select-duration, 150ms) var(--sng-select-ease, ease) both; }
    .sng-select-content[data-state=closed] { animation: sng-select-exit var(--sng-select-duration, 150ms) var(--sng-select-ease, ease) both; }
    @keyframes sng-select-enter { from { opacity: 0; transform: scale(0.95); } }
    @keyframes sng-select-exit { to { opacity: 0; transform: scale(0.95); } }
  `],
  template: `
    <button
      #triggerButton
      type="button"
      role="combobox"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-controls]="listboxId"
      [disabled]="disabled()"
      [class]="triggerClasses()"
      (click)="toggle()"
    >
      <span class="flex-1 text-left truncate" [class.text-muted-foreground]="!value()">
        {{ displayValue() || placeholder() }}
      </span>
      @if (searchable()) {
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
          class="opacity-50 shrink-0"
        >
          <path d="m7 15 5 5 5-5"/>
          <path d="m7 9 5-5 5 5"/>
        </svg>
      } @else {
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
          class="opacity-50 shrink-0"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      }
    </button>

    <div
      #dropdownPanel
      [id]="listboxId"
      role="listbox"
      tabindex="-1"
      class="sng-select-content"
      [attr.data-state]="isOpen() ? 'open' : 'closed'"
      [class]="contentClasses()"
      [hidden]="!dropdownVisible()"
    >
        @if (searchable()) {
          <div class="flex items-center border-b border-border px-3 py-2 gap-2">
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
              class="shrink-0 opacity-50"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              #searchInput
              type="text"
              name="search"
              [placeholder]="searchPlaceholder()"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
              class="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
            />
          </div>
        }
        <div [class]="innerContentClasses()">
          <ng-content />
        </div>
    </div>
  `,
})
export class SngSelect {
  private document = inject(DOCUMENT);
  private elementRef = inject(ElementRef);
  private injector = inject(Injector);

  /** @internal Unique ID for ARIA linking */
  readonly listboxId = createSelectListboxId();

  /** @internal Reference to the dropdown panel element */
  private dropdownPanel = viewChild<ElementRef<HTMLDivElement>>('dropdownPanel');

  /** @internal Reference to the trigger button element */
  private triggerButton = viewChild.required<ElementRef<HTMLButtonElement>>('triggerButton');

  /** @internal Reference to the search input element (searchable mode only) */
  private searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /** The currently selected value. */
  value = model<string>('');

  /** Placeholder text shown when no value is selected. */
  placeholder = input<string>('Select an option');

  /** Whether the select is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Whether the select has a search input for filtering items. */
  searchable = input(false, { transform: booleanAttribute });

  /** Placeholder text for the search input (searchable mode only). */
  searchPlaceholder = input<string>('Search...');

  /** Custom CSS classes. */
  class = input<string>('');

  /** @internal */
  isOpen = signal(false);
  /** @internal */
  dropdownVisible = signal(false);
  /** @internal */
  displayValue = signal<string>('');
  /** @internal */
  searchQuery = signal('');
  /** @internal */
  visibleItemCount = signal(0);
  private _closing = false;

  /** @internal Query all items to find display value */
  items = contentChildren(SngSelectItem, { descendants: true });

  constructor() {
    // Update display value when value changes
    effect(() => {
      const currentValue = this.value();
      const allItems = this.items();
      const selectedItem = allItems.find(item => item.value() === currentValue);
      if (selectedItem) {
        this.displayValue.set(selectedItem._getTextContent());
      } else if (!currentValue) {
        this.displayValue.set('');
      }
    });

    // Focus behavior when menu opens
    effect(() => {
      if (this.isOpen() && this.searchable()) {
        afterNextRender(() => {
          this.searchInputRef()?.nativeElement.focus({ preventScroll: true });
        }, { injector: this.injector });
      }
    });
  }

  triggerClasses = computed(() =>
    cn(
      'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent',
      'h-9 py-2 text-sm px-3',
      'whitespace-nowrap shadow-xs',
      TRANSITION_SHADOW,
      FOCUS_RING,
      SVG_BASE,
      'data-[placeholder]:text-muted-foreground',
      '[&_svg:not([class*=text-])]:text-muted-foreground',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      'dark:bg-input/30 dark:hover:bg-input/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  contentClasses = computed(() =>
    cn(
      'absolute left-0 top-[calc(100%+4px)] w-full z-50 max-h-96 rounded-md border border-border bg-popover text-popover-foreground shadow-md',
      this.searchable() ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden',
    )
  );

  innerContentClasses = computed(() =>
    this.searchable() ? 'overflow-y-auto overflow-x-hidden max-h-72' : ''
  );

  toggle() {
    if (this.disabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.disabled() || this.isOpen() || this._closing) return;
    if (this.searchable()) this.searchQuery.set('');
    this.dropdownVisible.set(true);
    this.isOpen.set(true);
  }

  close() {
    if (!this.isOpen() || this._closing) return;
    this._closing = true;
    this.isOpen.set(false);
    const panel = this.dropdownPanel()?.nativeElement;
    if (panel) {
      const animations = panel.getAnimations({ subtree: true });
      if (animations.length > 0) {
        Promise.allSettled(animations.map(animation => animation.finished)).finally(() => this.afterClose());
      } else {
        this.afterClose();
      }
    } else {
      this.afterClose();
    }
  }

  private afterClose() {
    this._closing = false;
    this.dropdownVisible.set(false);
    if (this.searchable()) this.searchQuery.set('');
    const active = this.document.activeElement;
    if (!active || this.elementRef.nativeElement.contains(active) || active === this.document.body) {
      this.triggerButton().nativeElement.focus();
    }
  }

  /** @internal Called by child SngSelectItem when an option is selected. */
  _selectValue(value: string, displayText: string) {
    this.close();
    this.value.set(value);
    this.displayValue.set(displayText);
  }

  /** @internal Called by SngSelectItem when it becomes visible. */
  _incrementVisibleCount() {
    this.visibleItemCount.update(c => c + 1);
  }

  /** @internal Called by SngSelectItem when it becomes hidden. */
  _decrementVisibleCount() {
    this.visibleItemCount.update(c => Math.max(0, c - 1));
  }

  /** @internal */
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  /** @internal */
  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

}

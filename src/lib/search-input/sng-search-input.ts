import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  output,
  signal,
  computed,
  viewChild,
  ElementRef,
  inject,
  forwardRef,
  contentChildren,
  effect,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { cn } from './cn';
import { SngSearchInputItem } from './sng-search-input-item';
import { SNG_SEARCH_INPUT_CONTEXT, type SngSearchInputContext } from './sng-search-input-context';

let nextSearchInputId = 0;

function createSearchInputListboxId(): string {
  nextSearchInputId += 1;
  return `sng-search-listbox-${nextSearchInputId}`;
}

/** Search input with dropdown for results or command palette. */
@Component({
  selector: 'sng-search-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SNG_SEARCH_INPUT_CONTEXT,
      useExisting: forwardRef(() => SngSearchInput),
    },
  ],
  styles: [`
    /* Hide separators adjacent to hidden groups */
    sng-search-input-group[hidden] + sng-search-input-separator { display: none !important; }
    sng-search-input-separator:has(+ sng-search-input-group[hidden]) { display: none !important; }
  `],
  host: {
    '[class]': 'hostClasses()',
    '[attr.id]': 'null',
    '[attr.name]': 'null',
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <div class="relative w-full">
      <svg
        class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        #inputRef
        type="text"
        [attr.id]="id()"
        [attr.name]="name()"
        [placeholder]="placeholder() || (command() ? commandPlaceholder() : searchPlaceholder())"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [attr.autocomplete]="'off'"
        [value]="value()"
        [class]="inputClasses()"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur($event)"
        [attr.aria-label]="command() ? commandAriaLabel() : searchAriaLabel()"
        [attr.aria-expanded]="contentVisible()"
        [attr.aria-controls]="listboxId"
        role="combobox"
        aria-autocomplete="list"
      />
      @if (showClearButton() && value()) {
        <button
          type="button"
          (click)="onClear()"
          [disabled]="disabled()"
          class="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          [attr.aria-label]="clearAriaLabel()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      }
    </div>

    <div
      [id]="listboxId"
      role="listbox"
      tabindex="-1"
      [class]="contentClasses()"
      [hidden]="!contentVisible()"
    >
      <ng-content />
    </div>
  `,
})
export class SngSearchInput implements SngSearchInputContext {
  private elementRef = inject(ElementRef);
  private hostElement = this.elementRef.nativeElement as HTMLElement;
  private hasAppliedAutofocus = false;

  /** @internal Unique ID for ARIA linking */
  readonly listboxId = createSearchInputListboxId();

  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');

  // Query search items to detect whether projected content exists
  private searchItems = contentChildren(SngSearchInputItem, { descendants: true });

  constructor() {
    // Use effect to reactively detect content children changes
    effect(() => {
      const items = this.searchItems();
      this._hasContent.set(items.length > 0);
    });

    // Keep id/name on the internal input only, not on the custom element host.
    effect(() => {
      this.id();
      this.name();
      queueMicrotask(() => {
        this.hostElement.removeAttribute('id');
        this.hostElement.removeAttribute('name');
      });
    });

    effect(() => {
      if (!this.autofocus() || this.hasAppliedAutofocus) {
        return;
      }
      queueMicrotask(() => {
        this.inputRef()?.nativeElement.focus();
        this.hasAppliedAutofocus = true;
      });
    });
  }

  // =============================================================================
  // Inputs
  // =============================================================================

  /** Input id attribute. */
  id = input<string>();

  /** Input name attribute. */
  name = input<string>();

  /** Placeholder text. */
  placeholder = input<string>('');

  /** Placeholder text in regular search mode when `placeholder` is not provided. */
  searchPlaceholder = input<string>('Search...');

  /** Placeholder text in command mode when `placeholder` is not provided. */
  commandPlaceholder = input<string>('Type a command or search...');

  /** Whether the input is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Whether the input is readonly. */
  readonly = input(false, { transform: booleanAttribute });

  /** Whether to autofocus. */
  autofocus = input(false, { transform: booleanAttribute });

  /** Whether to use command palette mode (all items shown by default, filtered as user types). */
  command = input(false, { transform: booleanAttribute });

  /** Aria label for the input in regular search mode. */
  searchAriaLabel = input<string>('Search');

  /** Aria label for the input in command mode. */
  commandAriaLabel = input<string>('Command');

  /** Aria label for the clear button. */
  clearAriaLabel = input<string>('Clear');

  /** Whether to show the clear button when there's text. */
  showClearButton = input(true, { transform: booleanAttribute });

  /** Whether to render content inline instead of in a dropdown overlay. Use for dialogs. */
  inline = input(false, { transform: booleanAttribute });

  /** Maximum number of recently selected items to remember and show when idle. Set 0 to disable. */
  maxRecent = input(0, { transform: numberAttribute });

  /** Custom CSS classes. */
  class = input<string>('');

  // =============================================================================
  // State
  // =============================================================================

  /** Current value. Supports two-way binding via [(value)]. */
  value = model<string>('');

  /** @internal */
  private _searchQuery = signal('');
  /** @internal */
  private _visibleItemCount = signal(0);
  /** @internal */
  private _dropdownOpen = signal(false);
  /** @internal */
  private _hasContent = signal(false);
  /** @internal */
  private _recentValues = signal<string[]>([]);

  searchQuery = this._searchQuery.asReadonly();
  visibleItemCount = this._visibleItemCount.asReadonly();
  dropdownOpen = this._dropdownOpen.asReadonly();
  hasContent = this._hasContent.asReadonly();
  recentValues = this._recentValues.asReadonly();

  // =============================================================================
  // Outputs
  // =============================================================================

  /** Emitted when the clear button is clicked. */
  cleared = output<void>();

  // =============================================================================
  // Computed
  // =============================================================================

  hostClasses = computed(() => cn('relative block w-full', this.class()));

  inputClasses = computed(() =>
    cn(
      'flex w-full items-center bg-background',
      'h-9 text-sm py-1',
      this.showClearButton() ? 'pl-8 pr-8' : 'pl-8 pr-3',
      'transition-colors text-foreground',
      'placeholder:text-muted-foreground focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.inline()
        ? 'border-b border-border rounded-none'
        : 'rounded-md border border-border shadow-sm focus-visible:ring-1 focus-visible:ring-ring',
    )
  );

  /** Whether the content area is visible. Always true for inline, dropdown-controlled otherwise. */
  contentVisible = computed(() =>
    this.inline() || (this.dropdownOpen() && this.hasContent()
      && (this.visibleItemCount() > 0 || this._searchQuery() !== ''))
  );

  contentClasses = computed(() =>
    this.inline()
      ? 'w-full overflow-hidden'
      : 'absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-md'
  );

  // =============================================================================
  // Public Methods (SngSearchInputContext)
  // =============================================================================

  updateVisibleCount(delta: number): void {
    this._visibleItemCount.update(c => c + delta);
  }

  closeDropdown(): void {
    this._dropdownOpen.set(false);
  }

  trackSelection(value: string): void {
    const max = this.maxRecent();
    if (max <= 0 || !value) return;
    this._recentValues.update(prev => {
      const filtered = prev.filter(v => v !== value);
      return [value, ...filtered].slice(0, max);
    });
  }

  /** Focus the input element. */
  focus(): void {
    this.inputRef()?.nativeElement.focus();
  }

  /** Blur the input element. */
  blur(): void {
    this.inputRef()?.nativeElement.blur();
  }

  /** Clear the input value. */
  clear(): void {
    this.value.set('');
    this._searchQuery.set('');
    this.cleared.emit();
    this._dropdownOpen.set(false);
  }

  // =============================================================================
  // Event Handlers
  // =============================================================================

  /** @internal */
  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this._searchQuery.set(val);

    // Open dropdown when typing if there's content
    if (this._hasContent()) {
      this._dropdownOpen.set(true);
    }
  }

  /** @internal */
  onFocus(): void {
    if (this.inline()) return;
    // Open dropdown on focus if there's content
    if (this._hasContent()) {
      this._dropdownOpen.set(true);
    }
  }

  /** @internal */
  onBlur(event: FocusEvent): void {
    if (this.inline()) return;
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && this.elementRef.nativeElement.contains(nextTarget)) {
      return;
    }
    this._dropdownOpen.set(false);
  }

  /** @internal */
  onDocumentClick(event: MouseEvent): void {
    if (this.inline()) return;
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this._dropdownOpen.set(false);
    }
  }

  /** @internal */
  onClear(): void {
    if (this.disabled()) return;
    this.clear();
  }
}

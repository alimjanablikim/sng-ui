import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  model,
  viewChild,
  ElementRef,
  booleanAttribute,
  inject,
  DestroyRef,
  afterNextRender,
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { cn } from './cn';

/**
 * Styled input component for search or filter inputs within the sidebar.
 * Renders an internal input element with sidebar-appropriate styling.
 * Uses Angular's model() for two-way binding, compatible with Signal Forms.
 *
 * @example
 * ```html
 * <sng-layout-sidebar-header>
 *   <sng-layout-sidebar-input type="search" placeholder="Search..." />
 * </sng-layout-sidebar-header>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `
    <input
      #inputRef
      [type]="type()"
      [id]="id()"
      [name]="name()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [value]="value()"
      [class]="inputClasses()"
      (input)="onInput($event)"
    />
  `,
})
export class SngLayoutSidebarInput {
  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');
  private focusMonitor = inject(FocusMonitor);
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const elementRef = this.inputRef();
      if (!elementRef) return;

      const element = elementRef.nativeElement ?? elementRef;
      this.focusMonitor.monitor(element, true);

      this.destroyRef.onDestroy(() => {
        this.focusMonitor.stopMonitoring(element);
      });
    });
  }

  /** Input type. */
  type = input<string>('text');

  /** Input id attribute. */
  id = input<string>();

  /** Input name attribute. */
  name = input<string>();

  /** Placeholder text. */
  placeholder = input<string>('');

  /** Whether the input is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Custom CSS classes. */
  class = input<string>('');

  /** Current value. Supports two-way binding via [(value)]. */
  value = model<string>('');

  inputClasses = computed(() =>
    cn(
      'bg-background h-8 w-full shadow-none focus-visible:ring-2 ring-sidebar-ring rounded-md border border-input px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      this.class()
    )
  );

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  /** Focus the input element. */
  focus(): void {
    this.inputRef()?.nativeElement.focus();
  }

  /** Blur the input element. */
  blur(): void {
    this.inputRef()?.nativeElement.blur();
  }
}

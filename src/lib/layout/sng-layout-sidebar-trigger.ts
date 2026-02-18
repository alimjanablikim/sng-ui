import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  inject,
  booleanAttribute,
} from '@angular/core';
import { SNG_LAYOUT_SIDEBAR_CONTEXT } from './sng-layout-sidebar-provider';
import { cn } from './cn';

/**
 * Button that toggles the sidebar. Automatically calls `toggle()` on desktop or
 * `toggleMobile()` on mobile — no conditional logic needed in your template.
 *
 * @example
 * ```html
 * <!-- Default icon -->
 * <sng-layout-sidebar-trigger />
 *
 * <!-- Custom content -->
 * <sng-layout-sidebar-trigger [customContent]="true">
 *   <lucide-icon name="menu" />
 * </sng-layout-sidebar-trigger>
 * ```
 */
@Component({
  selector: 'sng-layout-sidebar-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="onClick()"
    >
      @if (customContent()) {
        <ng-content />
      } @else {
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M9 3v18" />
        </svg>
        <span class="sr-only">{{ toggleLabel() }}</span>
      }
    </button>
  `,
})
export class SngLayoutSidebarTrigger {
  /** Custom CSS classes. */
  class = input<string>('');

  /** Whether the button is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /**
   * When true, renders projected content instead of the default icon.
   */
  customContent = input(false, { transform: booleanAttribute });

  /** Accessible text for the default toggle control. */
  toggleLabel = input<string>('Toggle Sidebar');

  private context = inject(SNG_LAYOUT_SIDEBAR_CONTEXT);

  buttonClasses = computed(() =>
    cn(
      'inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      this.class()
    )
  );

  onClick(): void {
    if (this.context.isMobile()) {
      this.context.toggleMobile();
    } else {
      this.context.toggle();
    }
  }
}

import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  ElementRef,
  booleanAttribute,
  viewChild,
  inject,
  DestroyRef,
  afterNextRender,
  effect,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FocusMonitor } from '@angular/cdk/a11y';
import { cn } from './cn';

/**
 * Button type attribute.
 */
export type SngButtonType = 'button' | 'submit' | 'reset';

// Base interactive classes applied to all buttons
const INTERACTIVE_BASE = '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';

/**
 * Button component for user interactions.
 *
 * Renders as `<button>` by default, or `<a>` when `href` is provided.
 * Style the button using Tailwind classes via the `class` input.
 *
 * @example
 * ```html
 * <!-- Default style (primary) -->
 * <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">
 *   Primary
 * </sng-button>
 *
 * <!-- Destructive style -->
 * <sng-button class="bg-destructive text-white hover:bg-destructive/90">
 *   Delete
 * </sng-button>
 *
 * <!-- Outline style -->
 * <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">
 *   Cancel
 * </sng-button>
 *
 * <!-- Secondary style -->
 * <sng-button class="bg-secondary text-secondary-foreground hover:bg-secondary/80">
 *   Secondary
 * </sng-button>
 *
 * <!-- Ghost style -->
 * <sng-button class="hover:bg-accent hover:text-accent-foreground">
 *   Ghost
 * </sng-button>
 *
 * <!-- Link style -->
 * <sng-button class="text-primary underline-offset-4 hover:underline">
 *   Link
 * </sng-button>
 *
 * <!-- As anchor (auto-detects from href) -->
 * <sng-button href="/path" class="bg-primary text-primary-foreground">
 *   Link Button
 * </sng-button>
 *
 * <!-- With loading state -->
 * <sng-button [loading]="true" class="bg-primary text-primary-foreground">
 *   Loading...
 * </sng-button>
 *
 * <!-- Size variants via Tailwind classes -->
 * <sng-button class="h-8 px-3 text-xs bg-primary text-primary-foreground">Small</sng-button>
 * <sng-button class="h-10 px-6 text-base bg-primary text-primary-foreground">Large</sng-button>
 * <sng-button class="size-9 p-0 bg-primary text-primary-foreground"><svg>...</svg></sng-button>
 * ```
 */
@Component({
  selector: 'sng-button',
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `
    <ng-template #spinnerTpl>
      <svg
        class="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </ng-template>

    <!-- Button element (default, shown when no href) -->
    <button
      #buttonRef
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="buttonClasses()"
      [attr.aria-disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
      [style.display]="safeHref() ? 'none' : null"
    >
      @if (loading() && !href()) {
        <ng-container [ngTemplateOutlet]="spinnerTpl" />
      }
      <span #contentContainer style="display: contents">
        <ng-content />
      </span>
    </button>

    <!-- Anchor element (shown when href is provided) -->
    <a
      #anchorRef
      [attr.href]="safeHref()"
      [target]="target()"
      [attr.rel]="resolvedRel()"
      [class]="buttonClasses()"
      [attr.aria-disabled]="disabled() || loading()"
      [style.display]="safeHref() ? null : 'none'"
    >
      @if (loading() && href()) {
        <ng-container [ngTemplateOutlet]="spinnerTpl" />
      }
      <span #anchorContentTarget style="display: contents"></span>
    </a>
  `,
})
export class SngButton {
  private buttonRef = viewChild<ElementRef>('buttonRef');
  private anchorRef = viewChild<ElementRef>('anchorRef');
  private contentContainer = viewChild<ElementRef>('contentContainer');
  private anchorContentTarget = viewChild<ElementRef>('anchorContentTarget');
  private focusMonitor = inject(FocusMonitor);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // Move content between button and anchor based on href
    effect(() => {
      const hasHref = !!this.safeHref();
      const container = this.contentContainer()?.nativeElement;
      const target = this.anchorContentTarget()?.nativeElement;

      if (!container || !target) return;

      if (hasHref) {
        // Move content from button to anchor
        while (container.firstChild) {
          target.appendChild(container.firstChild);
        }
      } else {
        // Move content from anchor back to button
        while (target.firstChild) {
          container.appendChild(target.firstChild);
        }
      }
    });

    afterNextRender(() => {
      // Monitor the appropriate element for focus
      const updateFocusMonitor = () => {
        const hasHref = !!this.safeHref();
        const elementRef = hasHref ? this.anchorRef() : this.buttonRef();
        if (!elementRef) return;

        const element = elementRef.nativeElement ?? elementRef;
        this.focusMonitor.monitor(element, false);
      };

      updateFocusMonitor();

      this.destroyRef.onDestroy(() => {
        const buttonEl = this.buttonRef()?.nativeElement;
        const anchorEl = this.anchorRef()?.nativeElement;
        if (buttonEl) this.focusMonitor.stopMonitoring(buttonEl);
        if (anchorEl) this.focusMonitor.stopMonitoring(anchorEl);
      });
    });
  }

  /**
   * Custom CSS classes for styling.
   *
   * Apply style classes directly:
   * - Default: bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
   * - Destructive: bg-destructive text-white hover:bg-destructive/90
   * - Outline: border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground
   * - Secondary: bg-secondary text-secondary-foreground hover:bg-secondary/80
   * - Ghost: hover:bg-accent hover:text-accent-foreground
   * - Link: text-primary underline-offset-4 hover:underline
   *
   * Apply size classes:
   * - Small: h-8 px-3 text-xs
   * - Default: (built-in h-9 px-4 py-2 text-sm)
   * - Large: h-10 px-6 text-base
   * - Icon: size-9 p-0
   */
  class = input<string>('');

  /**
   * Whether the button is disabled.
   */
  disabled = input(false, { transform: booleanAttribute });

  /**
   * Whether the button shows a loading spinner.
   */
  loading = input(false, { transform: booleanAttribute });

  /**
   * Button type attribute (only for button, not anchor).
   */
  type = input<SngButtonType>('button');

  /**
   * URL for anchor. When provided, renders as `<a>` instead of `<button>`.
   */
  href = input<string>();

  /**
   * Target attribute for anchor.
   */
  target = input<string>();

  /**
   * Rel attribute for anchor. Defaults to 'noopener noreferrer' for external links.
   */
  rel = input<string>();

  /** @internal */
  resolvedRel = computed(() => {
    const value = this.rel()?.trim();
    if (value) return value;
    return this.target() === '_blank' ? 'noopener noreferrer' : null;
  });

  /** @internal */
  safeHref = computed(() => {
    const value = this.href()?.trim();
    if (!value) return null;
    return value.toLowerCase().startsWith('javascript:') ? null : value;
  });

  /** @internal */
  buttonClasses = computed(() => {
    return cn(
      // Base layout and default size
      'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap shrink-0 select-none cursor-pointer',
      'h-9 px-4 py-2 text-sm',
      INTERACTIVE_BASE,
      // Custom classes (user provides style + size overrides)
      this.class()
    );
  });
}

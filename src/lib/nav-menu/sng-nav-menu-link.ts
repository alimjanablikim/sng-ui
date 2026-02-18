import { Directive, input, booleanAttribute, computed } from '@angular/core';
import { cn } from './cn';

/**
 * Directive that styles anchor elements within navigation menu content.
 * Provides consistent hover, focus, and active states for menu links.
 * Supports an active state to indicate the current page.
 *
 * Uses attribute selector because it must attach directly to native `<a>` elements
 * to preserve anchor semantics (href and focus behavior).
 *
 * @example
 * ```html
 * <sng-nav-menu-content>
 *   <a sngNavMenuLink href="/docs/introduction">
 *     <span class="font-medium">Introduction</span>
 *     <span class="text-muted-foreground text-xs">Get started with the basics</span>
 *   </a>
 *   <a sngNavMenuLink href="/docs/installation" [active]="true">
 *     <span class="font-medium">Installation</span>
 *     <span class="text-muted-foreground text-xs">How to install dependencies</span>
 *   </a>
 * </sng-nav-menu-content>
 * ```
 */
@Directive({
  selector: '[sngNavMenuLink]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-active]': 'active() ? "true" : null',
  },
})
export class SngNavMenuLink {
  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Whether the link represents the current active page.
   * When true, applies highlighted styling to indicate current location.
   */
  active = input(false, { transform: booleanAttribute });

  hostClasses = computed(() =>
    cn(
      'data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground',
      'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
      'focus-visible:ring-ring/50 [&_svg:not([class*=text-])]:text-muted-foreground',
      'flex flex-col gap-1 rounded-sm p-2 text-sm transition-colors outline-none focus-visible:ring-[3px]',
      '[&_svg:not([class*=size-])]:size-4',
      this.class()
    )
  );
}

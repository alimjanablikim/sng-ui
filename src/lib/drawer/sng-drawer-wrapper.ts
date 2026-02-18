import { Directive, ElementRef, inject } from '@angular/core';

/**
 * Wrapper directive that enables background scaling animation.
 * Apply to the main content container that should scale when drawer opens.
 *
 * @example
 * ```html
 * <sng-drawer-wrapper class="min-h-screen">
 *   <app-header />
 *   <main>
 *     <sng-drawer>...</sng-drawer>
 *   </main>
 * </sng-drawer-wrapper>
 * ```
 */
@Directive({
  selector: 'sng-drawer-wrapper',
  standalone: true,
  host: {
    'class': 'block bg-background',
  },
})
export class SngDrawerWrapper {
  /** Reference to the host element for applying scale transforms */
  elementRef = inject(ElementRef<HTMLElement>);
}

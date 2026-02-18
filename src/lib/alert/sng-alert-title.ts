import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Title element for SngAlert.
 * Renders a heading (h5) inside sng-alert.
 *
 * @example
 * ```html
 * <sng-alert-title>Heads up!</sng-alert-title>
 * ```
 *
 * @publicApi
 */
@Component({
  selector: 'sng-alert-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'contents',
  },
  template: `<h5 [class]="titleClasses()"><ng-content /></h5>`,
})
export class SngAlertTitle {
  /**
   * Custom classes for title styling.
   *
   * Font: font-medium (default), font-semibold, font-bold
   * Size: text-sm (default), text-base, text-lg
   */
  class = input<string>('');

  titleClasses = computed(() =>
    cn(
      'col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight',
      this.class()
    )
  );
}

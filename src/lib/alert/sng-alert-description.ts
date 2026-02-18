import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Description element for SngAlert.
 * Renders a div containing the alert's descriptive content.
 *
 * @example
 * ```html
 * <sng-alert-description>
 *   You can add components and dependencies to your app using the CLI.
 * </sng-alert-description>
 * ```
 *
 * @publicApi
 */
@Component({
  selector: 'sng-alert-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'contents',
  },
  template: `<div [class]="descriptionClasses()"><ng-content /></div>`,
})
export class SngAlertDescription {
  /**
   * Custom classes for description styling.
   *
   * Text color: text-muted-foreground (default), text-destructive/80
   * Size: text-sm (default), text-xs
   */
  class = input<string>('');

  descriptionClasses = computed(() =>
    cn(
      'col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground',
      '[&_p]:leading-relaxed',
      this.class()
    )
  );
}

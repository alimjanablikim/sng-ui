import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Card description component for supplementary text.
 *
 * Renders a paragraph element within a card header
 * to provide additional context below the title.
 *
 * @example
 * ```html
 * <sng-card-description>Configure your notification preferences.</sng-card-description>
 * ```
 */
@Component({
  selector: 'sng-card-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `<p [class]="descriptionClasses()"><ng-content /></p>`,
})
export class SngCardDescription {
  /** Custom CSS classes. */
  class = input<string>('');

  descriptionClasses = computed(() =>
    cn('!m-0 text-sm text-muted-foreground', this.class())
  );
}

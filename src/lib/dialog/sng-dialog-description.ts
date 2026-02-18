import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Description component for dialog content.
 * Renders a paragraph element to provide consistent dialog description styling.
 *
 * @example
 * ```html
 * <sng-dialog-description>Make changes to your profile here. Click save when you're done.</sng-dialog-description>
 * ```
 */
@Component({
  selector: 'sng-dialog-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  template: `<p [class]="descriptionClasses()"><ng-content /></p>`,
})
export class SngDialogDescription {
  /** Custom CSS classes. */
  class = input<string>('');

  descriptionClasses = computed(() =>
    cn('text-sm text-muted-foreground', this.class())
  );
}

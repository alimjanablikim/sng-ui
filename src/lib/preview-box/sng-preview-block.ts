import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
} from '@angular/core';
import { cn } from './cn';

/**
 * Content wrapper for live demo in preview-box. Centers content with padding.
 *
 * @example
 * ```html
 * <sng-preview-block>
 *   <sng-button>Click me</sng-button>
 * </sng-preview-block>
 * ```
 */
@Component({
  selector: 'sng-preview-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
  },
  styles: [`
    sng-preview-block {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex-shrink: 0;
    }
  `],
  template: `<ng-content />`
})
export class SngPreviewBlock {
  /** Custom CSS classes. */
  class = input<string>('');

  hostClasses = computed(() => cn(
    'flex items-center justify-center p-6',
    this.class()
  ));
}

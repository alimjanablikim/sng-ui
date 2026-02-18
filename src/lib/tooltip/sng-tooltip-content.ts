import {
  Component,
  computed,
  signal,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from './cn';

/**
 * Internal component that renders the tooltip content.
 * Created dynamically by SngTooltip directive via CDK Overlay.
 *
 * @example
 * ```html
 * <!-- Used internally by SngTooltip directive -->
 * <sng-tooltip-content />
 * ```
 */
@Component({
  selector: 'sng-tooltip-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    sng-tooltip-content[data-state=open][data-side=bottom] { animation: sng-tooltip-enter-bottom 150ms ease both; }
    sng-tooltip-content[data-state=open][data-side=top] { animation: sng-tooltip-enter-top 150ms ease both; }
    sng-tooltip-content[data-state=open][data-side=left] { animation: sng-tooltip-enter-left 150ms ease both; }
    sng-tooltip-content[data-state=open][data-side=right] { animation: sng-tooltip-enter-right 150ms ease both; }
    sng-tooltip-content[data-state=closed] { animation: sng-tooltip-exit 150ms ease both; }
    @keyframes sng-tooltip-enter-bottom { from { opacity: 0; transform: scale(0.95) translateY(-0.5rem); } }
    @keyframes sng-tooltip-enter-top { from { opacity: 0; transform: scale(0.95) translateY(0.5rem); } }
    @keyframes sng-tooltip-enter-left { from { opacity: 0; transform: scale(0.95) translateX(0.5rem); } }
    @keyframes sng-tooltip-enter-right { from { opacity: 0; transform: scale(0.95) translateX(-0.5rem); } }
    @keyframes sng-tooltip-exit { to { opacity: 0; transform: scale(0.95); } }
  `],
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-side]': 'side()',
    '[attr.data-state]': 'state()',
    'role': 'tooltip',
  },
  template: `{{ text() }}`,
})
export class SngTooltipContent {
  /** Tooltip text content. Set by parent SngTooltip directive. */
  text = signal('');

  /** Position side of the tooltip. Set by parent SngTooltip directive. */
  side = signal<'top' | 'bottom' | 'left' | 'right'>('top');

  /** Open/closed state for animation. Set by parent SngTooltip directive. */
  state = signal<'open' | 'closed'>('open');

  /** Custom CSS classes. Set by parent SngTooltip directive. */
  customClass = signal('');

  hostClasses = computed(() =>
    cn(
      'z-50 w-fit rounded-md bg-foreground text-background px-3 py-1.5 text-xs text-balance',
      this.customClass()
    )
  );
}

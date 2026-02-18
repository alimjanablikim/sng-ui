import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  computed,
  TemplateRef,
  ViewContainerRef,
  inject,
  viewChild,
} from '@angular/core';
import { cn } from './cn';

/**
 * Popover content panel, rendered in a CDK overlay when open.
 *
 * @example
 * ```html
 * <sng-popover-content class="w-80">
 *   <p>Content here</p>
 * </sng-popover-content>
 * ```
 */
@Component({
  selector: 'sng-popover-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'contents',
  },
  styles: [`
    .sng-popover-content[data-state=open] { animation: sng-popover-enter var(--sng-popover-duration, 150ms) var(--sng-popover-ease, ease) both; }
    .sng-popover-content[data-state=closed] { animation: sng-popover-exit var(--sng-popover-duration, 150ms) var(--sng-popover-ease, ease) both; }
    @keyframes sng-popover-enter { from { opacity: 0; transform: scale(0.95); } }
    @keyframes sng-popover-exit { to { opacity: 0; transform: scale(0.95); } }
  `],
  template: `
    <ng-template #content>
      <div
        class="sng-popover-content"
        data-state="open"
        [class]="contentClasses()">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class SngPopoverContent {
  /** Custom CSS classes. */
  class = input<string>('');

  private contentTemplate = viewChild.required<TemplateRef<unknown>>('content');
  viewContainerRef = inject(ViewContainerRef);

  get templateRef(): TemplateRef<unknown> {
    return this.contentTemplate();
  }

  contentClasses = computed(() =>
    cn(
      'z-50 w-72 rounded-md border border-border bg-popover text-popover-foreground p-4 shadow-md outline-none',
      this.class()
    )
  );
}

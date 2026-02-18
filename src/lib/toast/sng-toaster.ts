import {
  Component,
  inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { SngToastService, ToastPosition } from './sng-toast.service';
import { SngToast } from './sng-toast';
import { cn } from './cn';

const POSITIONS: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

const POSITION_CLASSES: Record<ToastPosition, string> = {
  'top-left': 'top-0 left-0 items-start',
  'top-right': 'top-0 right-0 items-end',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center',
  'bottom-left': 'bottom-0 left-0 items-start',
  'bottom-right': 'bottom-0 right-0 items-end',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 items-center',
};

/**
 * Container component that renders all active toast notifications. Place once
 * in your app's root layout to enable toast notifications throughout your application.
 * Automatically groups toasts by their configured position.
 *
 * @example
 * ```html
 * <!-- In your app.component.html or layout -->
 * <sng-toaster />
 * ```
 */
@Component({
  selector: 'sng-toaster',
  standalone: true,
  imports: [SngToast],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {},
  template: `
    @for (position of positions; track position) {
      @if (getToastsForPosition(position).length > 0) {
        <div [class]="getContainerClasses(position)">
          @for (toast of getToastsForPosition(position); track toast.id) {
            <sng-toast
              [toast]="toast"
              (dismissed)="toastService.dismiss(toast.id)"
            />
          }
        </div>
      }
    }
  `,
})
export class SngToaster {
  protected toastService = inject(SngToastService);
  protected positions = POSITIONS;

  getToastsForPosition(position: ToastPosition) {
    return this.toastService.toasts().filter(t => (t.position ?? 'bottom-right') === position);
  }

  getContainerClasses(position: ToastPosition): string {
    const base = 'fixed z-50 flex flex-col gap-2 p-4 max-h-screen w-full max-w-[420px] pointer-events-none';
    return cn(base, POSITION_CLASSES[position]);
  }
}

import {
  Component,
  input,
  model,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';
import type {
  SngAccordionApi,
  SngAccordionType,
  SngAccordionValue,
  SngAccordionOrientation,
  SngAccordionLayout,
} from './sng-accordion.types';
import { cn } from './cn';

/**
 * Root accordion container that manages expansion state.
 *
 * @example
 * ```html
 * <sng-accordion [(defaultValue)]="selectedItem">
 *   <sng-accordion-item value="item-1">
 *     <sng-accordion-trigger>Section 1</sng-accordion-trigger>
 *     <sng-accordion-content>Content 1</sng-accordion-content>
 *   </sng-accordion-item>
 * </sng-accordion>
 * ```
 *
 * @publicApi
 */
@Component({
  selector: 'sng-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [CdkAccordion],
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-layout]': 'layout()',
    '[attr.data-disabled]': 'disabled() || null',
  },
  template: `<ng-content />`,
})
export class SngAccordion implements SngAccordionApi {
  /** Expansion mode: `'single'` (one at a time) or `'multiple'`. */
  type = input<SngAccordionType>('single');

  /** Whether expanded items can be collapsed by clicking again. */
  collapsible = input<boolean>(true);

  /** Whether the entire accordion is disabled. */
  disabled = input<boolean>(false);

  /** Orientation value for layout-related semantics. */
  orientation = input<SngAccordionOrientation>('vertical');

  /** Layout direction: `'vertical'` or `'horizontal'`. Affects layout and animation axis. */
  layout = input<SngAccordionLayout>('vertical');

  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Combined host classes based on layout.
   * @internal
   */
  hostClasses = computed(() =>
    cn(
      'w-full',
      // Horizontal: flex row for side-by-side panels; Vertical: standard block layout
      this.layout() === 'horizontal' ? 'flex flex-row items-stretch' : 'block',
      this.class()
    )
  );

  /** The value(s) of currently expanded item(s). Supports two-way binding. */
  defaultValue = model<SngAccordionValue>('');

  /** Whether accordion is in multiple expansion mode. */
  isMulti = computed(() => this.type() === 'multiple');

  /** Toggle expansion state of an item by its value. */
  toggle(value: string): void {
    const current = this.defaultValue();
    const expanded = this.isExpanded(value);

    if (expanded) {
      // Collapse if allowed
      if (this.collapsible() || this.isMulti()) {
        if (this.isMulti()) {
          const arr = Array.isArray(current) ? current : [];
          this.defaultValue.set(arr.filter(v => v !== value));
        } else {
          this.defaultValue.set('');
        }
      }
    } else {
      // Expand - in single mode, close others first
      if (this.isMulti()) {
        const arr = Array.isArray(current) ? current : [];
        this.defaultValue.set([...arr, value]);
      } else {
        this.defaultValue.set(value);
      }
    }
  }

  /** Check if a specific item is currently expanded. */
  isExpanded(value: string): boolean {
    const current = this.defaultValue();
    if (Array.isArray(current)) {
      return current.includes(value);
    }
    return current === value;
  }
}

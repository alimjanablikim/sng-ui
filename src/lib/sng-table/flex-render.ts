/**
 * @fileoverview FlexRender directive for rendering dynamic table content
 *
 * This directive handles rendering cell, header, and footer content
 * from column definitions. It supports template strings and functions.
 *
 * @example
 * ```html
 * <!-- In a table cell -->
 * <td>
 *   <ng-container *sngFlexRender="cell.column.columnDef.cell; context: cell.getContext()">
 *     {{ cell.getValue() }}
 *   </ng-container>
 * </td>
 *
 * <!-- Or using the component -->
 * <td>
 *   <sng-flex-render [render]="cell.column.columnDef.cell" [context]="cell.getContext()" />
 * </td>
 * ```
 */

import {
  Component,
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
  computed,
  effect,
  ChangeDetectionStrategy,
  EmbeddedViewRef,
  OnDestroy,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import type { ColumnDefTemplate, CellContext, HeaderContext } from '../sng-table-core';

// ============================================================================
// FLEX RENDER DIRECTIVE
// ============================================================================

/**
 * Context type for flex render
 */
export type FlexRenderContext<TData, TValue = unknown> =
  | CellContext<TData, TValue>
  | HeaderContext<TData, TValue>;

/**
 * Structural directive for rendering dynamic table content.
 *
 * Uses attribute selector because Angular structural directives (`*sngFlexRender`)
 * require attribute selectors — the `*` microsyntax only works with directives.
 *
 * @example
 * ```html
 * <ng-container *sngFlexRender="header.column.columnDef.header; context: header.getContext()">
 *   <!-- fallback content if render is undefined -->
 *   {{ header.column.id }}
 * </ng-container>
 * ```
 */
@Directive({
  selector: '[sngFlexRender]',
  standalone: true,
})
export class SngFlexRenderDirective<TData, TValue = unknown> implements OnDestroy {
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<unknown>);
  private document = inject(DOCUMENT);

  private currentView: EmbeddedViewRef<unknown> | null = null;
  private textNode: Text | null = null;

  /**
   * The render function or template from column definition
   */
  sngFlexRender = input<ColumnDefTemplate<FlexRenderContext<TData, TValue>> | undefined>();

  /**
   * The context object (CellContext or HeaderContext)
   */
  sngFlexRenderContext = input<FlexRenderContext<TData, TValue>>();

  constructor() {
    effect(() => {
      // Read signals to establish dependencies
      this.sngFlexRender();
      this.sngFlexRenderContext();
      this.updateView();
    });
  }

  private updateView(): void {
    // Clear previous view
    this.clear();

    const render = this.sngFlexRender();
    const context = this.sngFlexRenderContext();

    // If no render function, show fallback template
    if (!render) {
      this.currentView = this.viewContainer.createEmbeddedView(this.templateRef, context);
      return;
    }

    // Get the rendered value
    let value: unknown;
    if (typeof render === 'function') {
      value = context ? render(context) : undefined;
    } else {
      value = render;
    }

    // Render the value
    if (value === null || value === undefined) {
      // Show fallback
      this.currentView = this.viewContainer.createEmbeddedView(this.templateRef, context);
    } else {
      // Create a text node for the value
      this.textNode = this.document.createTextNode(String(value));
      const element = this.viewContainer.element.nativeElement as Comment;
      if (element.parentNode) {
        element.parentNode.insertBefore(this.textNode, element);
      }
    }
  }

  private clear(): void {
    if (this.currentView) {
      this.currentView.destroy();
      this.currentView = null;
    }
    if (this.textNode && this.textNode.parentNode) {
      this.textNode.parentNode.removeChild(this.textNode);
      this.textNode = null;
    }
    this.viewContainer.clear();
  }

  ngOnDestroy(): void {
    this.clear();
  }
}

// ============================================================================
// FLEX RENDER COMPONENT
// ============================================================================

/**
 * Component version of FlexRender for simpler usage
 *
 * @example
 * ```html
 * <sng-flex-render
 *   [render]="cell.column.columnDef.cell"
 *   [context]="cell.getContext()"
 * />
 * ```
 */
@Component({
  selector: 'sng-flex-render',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ displayValue() }}`,
})
export class SngFlexRenderComponent<TData, TValue = unknown> {
  /**
   * The render function or template from column definition
   */
  render = input<ColumnDefTemplate<FlexRenderContext<TData, TValue>> | undefined>();

  /**
   * The context object (CellContext or HeaderContext)
   */
  context = input<FlexRenderContext<TData, TValue>>();

  /**
   * Computed display value
   */
  protected displayValue = computed(() => {
    const render = this.render();
    const context = this.context();

    if (!render) return '';

    if (typeof render === 'function') {
      const result = context ? render(context) : undefined;
      return result != null ? String(result) : '';
    }

    return String(render);
  });
}

// ============================================================================
// FLEX RENDER HELPER FUNCTION
// ============================================================================

/**
 * Helper function to render column content
 *
 * This is useful when you need to get the rendered value programmatically.
 *
 * @example
 * ```typescript
 * const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
 * ```
 */
export function flexRender<TData, TValue>(
  render: ColumnDefTemplate<FlexRenderContext<TData, TValue>> | undefined,
  context: FlexRenderContext<TData, TValue>
): unknown {
  if (!render) return undefined;

  if (typeof render === 'function') {
    return render(context);
  }

  return render;
}

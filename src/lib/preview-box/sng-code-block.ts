import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { SngCodeBlock, type ShikiTheme } from '../code-block/sng-code-block';

/**
 * SngPreviewCodeBlock - TypeScript/code snippet for Code tab in preview-box.
 *
 * Displays syntax-highlighted TypeScript or other code in the Code tab of preview-box.
 * Wraps sng-code-block internally for consistent styling.
 *
 * @example
 * ```html
 * <sng-preview-box>
 *   <sng-preview-block>
 *     <sng-button>Click me</sng-button>
 *   </sng-preview-block>
 *   <sng-html-block [code]="htmlCode" />
 *   <sng-preview-code-block [code]="tsCode" [theme]="'github-dark'" />
 * </sng-preview-box>
 * ```
 */
@Component({
  selector: 'sng-preview-code-block',
  standalone: true,
  imports: [SngCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {},
  styles: [`
    sng-preview-code-block {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    sng-preview-code-block sng-code-block {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    sng-preview-code-block .code-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: none;
      border-radius: 0;
    }
    sng-preview-code-block .code-content {
      flex: 1;
      overflow: auto;
    }
  `],
  template: `
    <sng-code-block
      [code]="code()"
      [language]="language()"
      [theme]="theme()"
      [showHeader]="false"
    />
  `
})
export class SngPreviewCodeBlock {
  /**
   * The TypeScript or other code string to display with syntax highlighting.
   */
  code = input.required<string>();

  /**
   * The language for syntax highlighting.
   */
  language = input<string>('typescript');

  /**
   * The Shiki theme for syntax highlighting.
   */
  theme = input<ShikiTheme>('github-light');
}

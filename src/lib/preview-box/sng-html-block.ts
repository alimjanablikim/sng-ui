import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { SngCodeBlock, type ShikiTheme } from '../code-block/sng-code-block';

/**
 * SngHtmlBlock - HTML code snippet for HTML tab in preview-box.
 *
 * Displays syntax-highlighted HTML code in the HTML tab of preview-box.
 * Wraps sng-code-block internally for consistent styling.
 *
 * @example
 * ```html
 * <sng-preview-box>
 *   <sng-preview-block>
 *     <sng-button>Click me</sng-button>
 *   </sng-preview-block>
 *   <sng-html-block [code]="htmlSnippet" [theme]="'github-dark'" />
 * </sng-preview-box>
 * ```
 */
@Component({
  selector: 'sng-html-block',
  standalone: true,
  imports: [SngCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {},
  styles: [`
    sng-html-block {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    sng-html-block sng-code-block {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    sng-html-block .code-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: none;
      border-radius: 0;
    }
    sng-html-block .code-content {
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
export class SngHtmlBlock {
  /**
   * The HTML code string to display with syntax highlighting.
   */
  code = input.required<string>();

  /**
   * The language for syntax highlighting.
   */
  language = input<string>('html');

  /**
   * The Shiki theme for syntax highlighting.
   */
  theme = input<ShikiTheme>('github-light');
}

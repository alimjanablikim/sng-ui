import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { SngCodeBlock, type ShikiTheme } from '../code-block/sng-code-block';

/**
 * SngStyleBlock - CSS/Tailwind styles for Style tab in preview-box.
 *
 * Displays syntax-highlighted CSS or style code in the Style tab of preview-box.
 * Wraps sng-code-block internally for consistent styling.
 *
 * @example
 * ```html
 * <sng-preview-box>
 *   <sng-preview-block>
 *     <div class="custom-card">Card content</div>
 *   </sng-preview-block>
 *   <sng-html-block [code]="htmlCode" />
 *   <sng-style-block [code]="cssStyles" [theme]="'github-dark'" />
 * </sng-preview-box>
 * ```
 */
@Component({
  selector: 'sng-style-block',
  standalone: true,
  imports: [SngCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {},
  styles: [`
    sng-style-block {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    sng-style-block sng-code-block {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    sng-style-block .code-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      border: none;
      border-radius: 0;
    }
    sng-style-block .code-content {
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
export class SngStyleBlock {
  /**
   * The CSS/style code string to display with syntax highlighting.
   */
  code = input.required<string>();

  /**
   * The language for syntax highlighting.
   */
  language = input<string>('css');

  /**
   * The Shiki theme for syntax highlighting.
   */
  theme = input<ShikiTheme>('github-light');
}

import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnDestroy,
  input,
  signal,
  computed,
  effect,
  inject,
  booleanAttribute,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { createHighlighter, type Highlighter, type BundledTheme } from 'shiki';
import { Subscription, timer } from 'rxjs';
import { cn } from './cn';

/**
 * Shiki built-in themes.
 * See https://shiki.style/themes for previews.
 */
export type ShikiTheme = BundledTheme;

/**
 * Common theme presets for quick reference:
 *
 * Light themes:
 * - 'github-light'
 * - 'github-light-default'
 * - 'one-light'
 * - 'vitesse-light'
 * - 'min-light'
 * - 'slack-ochin'
 *
 * Dark themes:
 * - 'github-dark'
 * - 'github-dark-default'
 * - 'one-dark-pro'
 * - 'vitesse-dark'
 * - 'min-dark'
 * - 'slack-dark'
 * - 'dracula'
 * - 'nord'
 * - 'tokyo-night'
 * - 'monokai'
 */

// Singleton highlighter - themes are loaded on-demand
let highlighterPromise: Promise<Highlighter> | null = null;
const loadedThemes = new Set<string>();

async function getShikiHighlighter(theme: string): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [theme],
      langs: ['typescript', 'javascript', 'json', 'bash', 'shell', 'html', 'css', 'tsx', 'jsx', 'markdown', 'yaml', 'text', 'mdx', 'angular-html']
    });
    loadedThemes.add(theme);
  }

  const highlighter = await highlighterPromise;

  // Load additional theme if not already loaded
  if (!loadedThemes.has(theme)) {
    await highlighter.loadTheme(theme as BundledTheme);
    loadedThemes.add(theme);
  }

  return highlighter;
}

/**
 * ShadNG Code Block - VS Code-accurate syntax highlighting with copy button.
 *
 * REQUIRES: `npm install shiki` - without it, this component will fail to load.
 * See registry.json for installation details.
 */
@Component({
  selector: 'sng-code-block',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '_hostClasses()',
  },
  styles: [`
    sng-code-block { display: block; }
    sng-code-block .code-container {
      position: relative;
      border-radius: 8px;
      border: 1px solid var(--border);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    sng-code-block .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 12px;
      border-bottom: 1px solid var(--border);
      background: var(--muted);
      flex-shrink: 0;
    }
    sng-code-block .language-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--foreground);
      text-transform: uppercase;
      line-height: 1;
    }
    sng-code-block .copy-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 2px 6px;
      border: none;
      border-radius: 4px;
      background: transparent;
      font-size: 12px;
      color: var(--muted-foreground);
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      line-height: 1;
    }
    sng-code-block .copy-btn:hover {
      background: color-mix(in oklch, var(--accent) 40%, transparent);
      color: var(--foreground);
    }
    sng-code-block .copy-btn.copied {
      color: oklch(var(--primary));
    }
    sng-code-block .code-content {
      overflow-x: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    /* Let Shiki's theme handle background colors */
    sng-code-block .code-content pre.shiki {
      margin: 0;
      padding: 16px;
      border-radius: 0;
      font-size: 13px;
      line-height: 1.45;
      flex: 1;
      min-width: fit-content;
    }
    sng-code-block .code-content pre.shiki code {
      display: block;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      width: fit-content;
      min-width: 100%;
    }
    sng-code-block .code-content pre.shiki .line {
      display: block;
    }
    sng-code-block .code-content .line:empty::before {
      content: ' ';
    }
    sng-code-block svg { display: block; }
  `],
  template: `
    <div class="code-container">
      @if (showHeader()) {
        <div class="code-header">
          <span class="language-label">{{ language() }}</span>
          <button class="copy-btn" [class.copied]="_copied()" (click)="copyCode()">
            @if (_copied()) {
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
              Copied!
            } @else {
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              Copy
            }
          </button>
        </div>
      }
      <div class="code-content" [innerHTML]="_highlightedCode()"></div>
    </div>
  `
})
export class SngCodeBlock implements OnDestroy {
  private sanitizer = inject(DomSanitizer);
  private copiedResetSubscription: Subscription | null = null;

  /**
   * Custom CSS classes to apply to the component.
   */
  class = input<string>('');

  /**
   * The code to display with syntax highlighting.
   */
  code = input.required<string>();

  /**
   * Programming language for syntax highlighting.
   * Supported: typescript, javascript, json, bash, shell, html, css, tsx, jsx, markdown, yaml, text, mdx
   */
  language = input<string>('typescript');

  /**
   * Shiki theme for syntax highlighting.
   * Accepts any Shiki BundledTheme - see https://shiki.style/themes for all available themes.
   *
   * Common themes: 'github-light', 'github-dark', 'dracula', 'nord', 'tokyo-night', 'one-dark-pro', 'monokai'
   */
  theme = input<ShikiTheme>('github-light');

  /**
   * Whether to show the header with language label and copy button.
   */
  showHeader = input(true, { transform: booleanAttribute });

  /** @internal */
  _highlightedCode = signal<SafeHtml>('');

  /** @internal */
  _copied = signal(false);

  /** @internal */
  _hostClasses = computed(() => cn('block', this.class()));

  constructor() {
    effect(() => {
      const code = this.code();
      const lang = this.language();
      const theme = this.theme();
      this.highlight(code, lang, theme);
    });
  }

  private async highlight(code: string, lang: string, theme: ShikiTheme) {
    try {
      const highlighter = await getShikiHighlighter(theme);
      const effectiveLang = lang || 'text';

      // Normalize line endings
      const normalizedCode = code
        .replace(/\r\n/g, '\n')  // Windows to Unix
        .replace(/\r/g, '\n')    // Old Mac to Unix
        .trim();

      let html = highlighter.codeToHtml(normalizedCode, {
        lang: effectiveLang,
        theme
      });

      // Remove newlines between span.line elements to prevent double line breaks
      html = html.replace(/<\/span>\n<span class="line">/g, '</span><span class="line">');

      // Use bypassSecurityTrustHtml to preserve inline styles from Shiki
      this._highlightedCode.set(this.sanitizer.bypassSecurityTrustHtml(html));
    } catch (e) {
      console.error('Shiki highlighting failed:', e);
      // Fallback to plain code
      this._highlightedCode.set(this.sanitizer.bypassSecurityTrustHtml(`<pre><code>${this.escapeHtml(code)}</code></pre>`));
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /**
   * Copy the code to clipboard.
   */
  copyCode() {
    const codeText = this.code();
    if (codeText && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(codeText).then(() => {
        this.copiedResetSubscription?.unsubscribe();
        this._copied.set(true);
        this.copiedResetSubscription = timer(2000).subscribe(() => {
          this._copied.set(false);
          this.copiedResetSubscription = null;
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.copiedResetSubscription?.unsubscribe();
    this.copiedResetSubscription = null;
  }
}

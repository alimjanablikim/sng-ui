
# ShadNG Code Block

VS Code-accurate syntax highlighting with Shiki. One-click copy, 13+ languages, light/dark themes. Built for Angular documentation sites.

## Installation

### Step 1: Install shiki dependency

```bash
npm install shiki
```

### Step 2: Add the component

```bash
npx @shadng/sng-ui add code-block
```

## Basic Usage

```html
<sng-code-block
  [code]="yourCode"
  language="typescript"
  [theme]="codeTheme()"
/>
```

## Hidden Header

```html
<!-- Inline code display without header -->
<sng-code-block
  [code]="'npm install shiki'"
  language="bash"
  [showHeader]="false"
/>
```

## Theme Switching

```typescript
// Component class
codeTheme = signal<ShikiTheme>('github-light');

// Detect system theme
ngOnInit() {
  const isDark = document.documentElement.classList.contains('dark');
  this.codeTheme.set(isDark ? 'github-dark' : 'github-light');
}
```

```html
<!-- Light theme -->
<sng-code-block [code]="code" theme="github-light" />

<!-- Dark theme -->
<sng-code-block [code]="code" theme="github-dark" />

<!-- Dynamic theme -->
<sng-code-block [code]="code" [theme]="codeTheme()" />
```

## Supported Languages

The component supports 14 languages out of the box:

- `typescript`, `javascript`, `json`
- `html`, `css`, `angular-html`
- `bash`, `shell`
- `tsx`, `jsx`
- `markdown`, `yaml`, `text`, `mdx`

---

# SngCodeBlock Technical Reference

High-signal technical documentation for AI coding assistants. No marketing. TypeScript interfaces, Shiki integration, edge cases.

## Component Architecture

```typescript
// 1 component (standalone):
// 1. SngCodeBlock - VS Code-accurate syntax highlighting with copy button
```

## Component Interface

```typescript
// SngCodeBlock - Syntax highlighted code display
interface SngCodeBlockApi {
  // INPUTS (all via input())
  code: InputSignal<string>;               // REQUIRED - code to display
  language: InputSignal<string>;           // Default: 'typescript'
  theme: InputSignal<ShikiTheme>;          // Default: 'github-light'
  showHeader: InputSignal<boolean>;        // Default: true
  class: InputSignal<string>;              // Default: ''

  // INTERNAL SIGNALS
  highlightedCode: Signal<SafeHtml>;       // Rendered HTML from Shiki
  copied: Signal<boolean>;                 // Copy feedback state

  // METHODS
  copyCode(): void;                        // Copy to clipboard with feedback
}

// Shiki theme type (re-exported from shiki)
type ShikiTheme = BundledTheme;

// Common theme presets
type CommonLightThemes = 'github-light' | 'github-light-default' | 'one-light' | 'vitesse-light';
type CommonDarkThemes = 'github-dark' | 'github-dark-default' | 'one-dark-pro' | 'dracula' | 'nord' | 'tokyo-night';
```

## Import Requirements

```typescript
// Single component import
import { SngCodeBlock } from 'sng-ui';

// With type for theme
import { SngCodeBlock, type ShikiTheme } from 'sng-ui';

@Component({
  standalone: true,
  imports: [SngCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  codeTheme = signal<ShikiTheme>('github-light');
}
```

## Shiki Integration

```typescript
// Singleton highlighter - themes loaded on-demand
let highlighterPromise: Promise<Highlighter> | null = null;
const loadedThemes = new Set<string>();

// Languages loaded at initialization
const SUPPORTED_LANGUAGES = [
  'typescript', 'javascript', 'json', 'bash', 'shell',
  'html', 'css', 'tsx', 'jsx', 'markdown', 'yaml',
  'text', 'mdx', 'angular-html'
];

// Themes loaded dynamically when first used
// getShikiHighlighter(theme) loads theme if not cached
```

## Theme Detection Pattern

```typescript
@Component({
  standalone: true,
  imports: [SngCodeBlock],
})
export class DocsComponent implements OnInit, OnDestroy {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  codeTheme = signal<ShikiTheme>('github-light');
  private themeObserver: MutationObserver | null = null;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initial theme detection
      const isDark = this.document.documentElement.classList.contains('dark');
      this.codeTheme.set(isDark ? 'github-dark' : 'github-light');

      // Watch for theme changes
      this.themeObserver = new MutationObserver(() => {
        const isDark = this.document.documentElement.classList.contains('dark');
        this.codeTheme.set(isDark ? 'github-dark' : 'github-light');
      });

      this.themeObserver.observe(this.document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  ngOnDestroy() {
    this.themeObserver?.disconnect();
  }
}
```

## Graceful Fallback

```typescript
// If Shiki fails (not installed, network error, etc.)
// Component falls back to plain monospace text

private async highlight(code: string, lang: string, theme: ShikiTheme) {
  try {
    const highlighter = await getShikiHighlighter(theme);
    const html = highlighter.codeToHtml(code, { lang, theme });
    this.highlightedCode.set(this.sanitizer.bypassSecurityTrustHtml(html));
  } catch (e) {
    console.error('Shiki highlighting failed:', e);
    // Fallback to escaped plain text
    this.highlightedCode.set(
      this.sanitizer.bypassSecurityTrustHtml(`<pre><code>${this.escapeHtml(code)}</code></pre>`)
    );
  }
}
```

## Copy to Clipboard

```typescript
// Copy button with visual feedback
copyCode() {
  const codeText = this.code();
  if (codeText && typeof navigator !== 'undefined') {
    navigator.clipboard.writeText(codeText).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}

// Template
@if (copied()) {
  <svg><!-- checkmark --></svg> Copied!
} @else {
  <svg><!-- copy icon --></svg> Copy
}
```

## Line Ending Normalization

```typescript
// Handles Windows, Unix, and old Mac line endings
const normalizedCode = code
  .replace(/\r\n/g, '\n')  // Windows (CRLF) to Unix (LF)
  .replace(/\r/g, '\n')    // Old Mac (CR) to Unix (LF)
  .trim();
```

## Edge Cases & Constraints

```typescript
// 1. SHIKI REQUIRED
// npm install shiki - without it, component fails to highlight
// Falls back to plain text with console error

// 2. BUNDLE SIZE
// Shiki adds ~2MB (WebAssembly for TextMate grammars)
// Themes loaded on-demand to reduce initial load

// 3. SSR CONSIDERATIONS
// Uses isPlatformBrowser for clipboard and MutationObserver
// Initial render works server-side (empty highlight)

// 4. UNSUPPORTED LANGUAGE
// Falls back to 'text' if language not in supported list
// No error thrown, just no syntax highlighting

// 5. THEME TYPE
// ShikiTheme = BundledTheme from shiki
// Any Shiki bundled theme works (30+ options)

// 6. CODE ESCAPING
// Raw code stored, HTML escaped only in fallback
// Shiki handles escaping in normal flow
```

## Do's and Don'ts

### Do
- Install shiki as a dependency: `npm install shiki`
- Always specify the language input for proper highlighting
- Match theme to your app's theme mode (github-light/github-dark)
- Use MutationObserver to react to theme changes
- Keep code examples focused and minimal
- Test the copy button with various code content

### Don't
- Forget to install shiki (component will fail silently)
- Use unsupported languages without fallback text
- Ignore bundle size impact (~2MB for Shiki)
- Hardcode theme when app supports light/dark mode
- Put very long code blocks without scrolling container

## Common Mistakes

1. **Missing shiki dependency** - Component requires `npm install shiki`. Without it, highlighting fails and falls back to plain text.

2. **Hardcoded theme** - Using `theme="github-light"` when app has dark mode. Wire theme to your theme detection.

3. **Unsupported language** - Shiki supports many languages but this component only loads 14. Unknown languages fall back to 'text'.

4. **SSR errors** - Using `navigator` or `MutationObserver` without platform check. Always guard with `isPlatformBrowser()`.

5. **Code not updating** - The component uses an effect to re-highlight when code/language/theme change. Make sure inputs are reactive.

## Accessibility Summary

### Automatic Features
- Copy button is a native `<button>` element
- Focus states visible on button hover/focus
- "Copied!" feedback is visual (visible text change)
- Code uses semantic `<pre><code>` structure
- Monospace font for code readability

### Focus Navigation
- Focus can reach the copy button
- Click to copy
- Standard focus order

### Screen Readers
- Button announces "Copy" / "Copied!" state
- Code content readable as preformatted text

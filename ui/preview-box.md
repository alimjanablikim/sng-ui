
# ShadNG Preview Box

`preview-box` is a docs-focused container that combines a live demo with source tabs in one surface.

## Installation

```bash
npx @shadng/sng-ui add preview-box
```

## Basic Usage

```html
<sng-preview-box>
  <sng-preview-block>
    <sng-button>Click me</sng-button>
  </sng-preview-block>

  <sng-html-block [code]="htmlCode" [theme]="theme" />
  <sng-code-block [code]="tsCode" [theme]="theme" />
  <sng-style-block [code]="cssCode" [theme]="theme" />
</sng-preview-box>
```

## Tabs and Visibility

- `Preview` is always visible.
- `HTML` appears when `sng-html-block` has non-empty `code`.
- `Code` appears when `sng-code-block` has non-empty `code`.
- `Style` appears when `sng-style-block` has non-empty `code`.

## Height and Layout

- Default host height is `h-[350px]`.
- Override with `class` input, for example `class="h-[500px]"`.
- The preview area scrolls when preview content exceeds available height.

---

# Technical Reference

## Component Exports

```typescript
export { SngPreviewBoxComponent } from './sng-preview-box';
export { SngPreviewBlock } from './sng-preview-block';
export { SngHtmlBlock } from './sng-html-block';
export { SngCodeBlock } from './sng-code-block';
export { SngStyleBlock } from './sng-style-block';
export { SngPreviewCodeBlock } from './sng-preview-code-block';
```

## Input Contracts

```typescript
// sng-preview-box
class: string = '';

// sng-preview-block
class: string = '';

// sng-html-block
code: string; // required
language: string = 'html';
theme: ShikiTheme = 'github-light';

// sng-code-block
code: string; // required
language: string = 'typescript';
theme: ShikiTheme = 'github-light';

// sng-style-block
code: string; // required
language: string = 'css';
theme: ShikiTheme = 'github-light';
```

## Tab Visibility Rules

```typescript
// Preview tab is always rendered.
// HTML tab is rendered when html block has non-empty code.
// Code tab is rendered when code block has non-empty code.
// Style tab is rendered when style block has non-empty code.
type PreviewTab = 'preview' | 'html' | 'code' | 'style';
```

## Runtime Behavior

```typescript
// Active tab uses internal signal state.
// Indicator position is measured from active tab geometry.
// Background toggle switches between muted/theme surfaces.
// Fullscreen uses a fixed overlay container and closes by control/backdrop.
```

# ShadNG UI (`@shadng/sng-ui`)

Angular UI component library inspired by shadcn/ui design patterns.

## Gallery
https://shadng.js.org

[![npm](https://img.shields.io/npm/v/%40shadng%2Fsng-ui)](https://www.npmjs.com/package/@shadng/sng-ui)
[![Angular](https://img.shields.io/badge/Angular-21-dd0031)](https://angular.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## CLI (Copy-Paste Model)

```bash
npx @shadng/sng-ui init
npx @shadng/sng-ui add button
npx @shadng/sng-ui add --all
npx @shadng/sng-ui add table menu
```

The CLI copies editable component source into your app.

## Installation

```bash
npm install @shadng/sng-ui
```

Peer dependencies:

```json
{
  "@angular/common": "^21.0.0",
  "@angular/core": "^21.0.0",
  "@angular/platform-browser": "^21.0.0",
  "shiki": "^3.0.0"
}
```

`shiki` is optional and only needed for `code-block` / `preview-box`.

## Usage

```ts
import { Component } from '@angular/core';
import { SngButton } from '@shadng/sng-ui';

@Component({
  selector: 'app-example',
  imports: [SngButton],
  template: `
    <sng-button class="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">
      Click me
    </sng-button>
  `,
})
export class ExampleComponent {}
```

## Theming

Theme tokens are defined in `src/lib/styles/sng-themes.css`.

## Package Checks

```bash
npm run test:cli
npm run pack:check
```

## License

MIT

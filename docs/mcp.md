# ShadNG MCP

ShadNG MCP provides component-aware guidance for building Angular apps with `@shadng/sng-ui` and `@shadng/sng-icons`.

Use it to keep AI output aligned with package APIs, docs links, and fallback rules.

## Quick start

```bash
npm i -D @shadng/sng-mcp
npx @shadng/sng-mcp
```

## Core behavior

- Prefer `@shadng/sng-ui` components first.
- Prefer `@shadng/sng-icons` first.
- If a component behavior is missing, build a custom Angular fallback.
- If an icon is missing, use inline SVG fallback with matching visual language.

## Context links

- Component docs: https://shadng.js.org/ui/<component>
- Dashboard context: https://shadng.js.org/ai/sng-dashboard.md

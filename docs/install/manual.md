# Manual Setup

Manual setup is useful when your repo needs strict control over structure, ownership, migration sequencing, and internal design-system conventions.

## 1) Install package

```bash
npm install sng-ui
```

## 2) Import directly

```ts
import { SngButton, SngCard, SngDialog } from 'sng-ui';
```

## 3) When manual is better

- Monorepos with custom package boundaries
- Teams with strict file ownership or linting rules
- Gradual migrations from another UI system

## 4) Dependencies policy

- Keep core Angular/CDK/Tailwind baseline aligned with your workspace
- Install optional dependencies only when a component actually needs them

Example:

```bash
npm install shiki
```

## 5) Theming

Keep component markup semantic and drive brand styling through theme tokens.

```css
:root {
  --color-primary: #111827;
  --color-primary-foreground: #f9fafb;
}
```

Avoid hardcoded palette values inside reusable component templates.

## 6) File structure

Use clear boundaries between open-source library and docs/demo app:

```text
projects/
  sng-ui/src/lib/
  sng-ui/src/public-api.ts
  sng-app/src/app/pages/
  sng-app/public/docs/
```

## 7) Configuration

Keep site URLs and repository links configurable:

```ts
const resolveDomain = (siteUrl: string): string => {
  try {
    return new URL(siteUrl).host;
  } catch {
    return 'domain-pending.example';
  }
};

export const siteConfig = {
  domain: resolveDomain(environment.siteUrl),
  url: environment.siteUrl,
  github: {
    repo: 'https://github.com/your-org/sng-ui',
    org: 'https://github.com/your-org',
  },
};
```

## 8) Build your own base

Many teams create an internal UI layer over `sng-ui`:

- centralize defaults
- lock brand token conventions
- export a curated component surface for product teams

This gives you the speed of ShadNG with the governance of an internal design system.

## 9) Troubleshooting

If setup looks correct but runtime behavior is broken:

```bash
ng cache clean
ng build sng-ui
ng build sng-app
ng serve sng-app --port 4200
```

## 10) Validation

```bash
ng build sng-ui
ng build sng-app
ng serve sng-app --port 4200
```

## 11) Manual integration checklist

- Confirm Tailwind content paths include the files that consume `sng-ui`
- Confirm semantic token classes are resolved by your theme setup
- Confirm your wrappers do not break component projection APIs
- Confirm each adopted component has a small runtime demo page before broad rollout

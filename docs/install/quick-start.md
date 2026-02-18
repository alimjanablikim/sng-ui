# Installation Quick Start

Use this page when you want a working setup in minutes and a clear path for scaling later.

## 1) Pick your path

- **CLI Installation**: fastest start, good defaults, easiest onboarding for new contributors.
- **Manual Setup**: best for monorepos, strict architecture rules, or staged migration plans.

If your team is unsure, start with CLI and move to Manual conventions once your internal UI layer is stable.

## 2) Prerequisites

- Node.js LTS
- Angular workspace already running
- Tailwind configured in the app where components are consumed

## 3) Minimum working setup

```bash
npx sng-ui@latest init
npx sng-ui@latest add button input
ng build sng-ui
ng build sng-app
```

## 4) First runtime check

Create a small page using one input and one button. Verify:

- Components render without console errors
- Theme tokens apply correctly in light/dark mode
- Your custom classes still override defaults when passed via `class`

## 5) What to do next

Continue install docs in order:

1. CLI Installation
2. Manual Setup
3. Dependencies
4. Theming
5. File Structure
6. Configuration
7. Deployment
8. Troubleshooting

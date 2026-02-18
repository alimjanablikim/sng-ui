# CLI Installation

CLI installation is the default path for most teams.
Use it when you want predictable setup, fast onboarding, and consistent project wiring.

## When to use CLI

- You want predictable setup with less onboarding friction
- You want generated source you can still edit directly
- You prefer staged adoption per component

## 1) Initialize

```bash
npx sng-ui@latest init
```

## 2) Add components

```bash
npx sng-ui@latest add button input dialog
```

## 3) Practical rollout order

- Start with primitives: `button`, `card`, `input`
- Add interactions next: `dialog`, `popover`, `menu`
- Add data/feedback after: `table`, `toast`, `progress`

## Typical rollout

```bash
# baseline primitives
npx sng-ui@latest add button card input

# interactions
npx sng-ui@latest add dialog popover menu

# data feedback
npx sng-ui@latest add table toast progress
```

## 4) Validate after each batch

```bash
ng build sng-ui
ng build sng-app
```

After each add step, run the docs app and open the matching `/ui/<component>` page to verify runtime behavior.

## 5) Update strategy

- Add components in small batches
- Validate runtime and tests before the next batch
- Keep generated source owned by your project; customize locally as needed

## 6) If CLI is blocked in your environment

Use the **Manual Setup** page and import from `sng-ui` directly. You can still follow the same adoption order and validation loop.

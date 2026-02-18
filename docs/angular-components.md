# ShadNG UI Angular Components

ShadNG UI is designed for teams that want to ship quickly without losing code ownership.
You can start with ready components, then adapt them into your own product system over time.

## Why this model works

Most UI libraries optimize for installation speed but hide implementation details.  
ShadNG keeps implementation readable so teams can move from "use it" to "own it" without a rewrite.

## What you get

- Angular-native standalone components with signal-oriented APIs
- Deterministic behavior patterns for overlays and state transitions
- Semantic token styling for light/dark and branded themes
- Copy-paste ownership of generated source in your own repository

## Component categories

- Primitives: button, card, badge, separator, skeleton, avatar
- Form controls: input, file input, OTP input, checkbox, radio, select, switch, slider
- Overlays: dialog, drawer, popover, hover card, tooltip, menu
- Navigation/data: tabs, breadcrumb, nav menu, layout, table, progress, toast

## API and customization

Visual changes should stay class-first. Behavior changes should stay input/output driven.

```ts
<sng-button [disabled]="disabled()" [class]="buttonClass()">Save changes</sng-button>
```

## Ownership and forking

You can use components directly, then modify source for your product:

- Rename APIs and adjust behavior to match your conventions
- Keep only components your team actually uses
- Replace token mappings for brand identity
- Fork this structure and publish your own internal UI package

## Start

```bash
npx sng-ui@latest init
npx sng-ui@latest add button
npx sng-ui@latest add input dialog
```


# ShadNG Avatar

User profile images with automatic fallback handling. Shows image when loaded, displays fallback content (initials or icon) while loading or on error.

## Installation

```bash
npx @shadng/sng-ui add avatar
```

## Basic Usage

```html
<sng-avatar>
  <sng-avatar-image src="https://example.com/user.jpg" alt="John Doe" />
  <sng-avatar-fallback>JD</sng-avatar-fallback>
</sng-avatar>
```

## Size Variants (via Tailwind classes)

Use the `class` input for custom sizes:

```html
<!-- Default size (40px) -->
<sng-avatar>...</sng-avatar>

<!-- Custom sizes via Tailwind -->
<sng-avatar class="size-6">...</sng-avatar>   <!-- 24px -->
<sng-avatar class="size-8">...</sng-avatar>   <!-- 32px -->
<sng-avatar class="size-12">...</sng-avatar>  <!-- 48px -->
<sng-avatar class="size-16">...</sng-avatar>  <!-- 64px -->
<sng-avatar class="size-20">...</sng-avatar>  <!-- 80px -->
```

## Fallback Content

```html
<!-- Text initials -->
<sng-avatar>
  <sng-avatar-image src="invalid-url.jpg" alt="User" />
  <sng-avatar-fallback>CN</sng-avatar-fallback>
</sng-avatar>

<!-- Icon fallback -->
<sng-avatar>
  <sng-avatar-image src="invalid-url.jpg" alt="User" />
  <sng-avatar-fallback>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  </sng-avatar-fallback>
</sng-avatar>
```

## Avatar Group

```html
<div class="flex -space-x-4">
  <sng-avatar class="border-2 border-background">
    <sng-avatar-image src="user1.jpg" alt="User 1" />
    <sng-avatar-fallback>U1</sng-avatar-fallback>
  </sng-avatar>
  <sng-avatar class="border-2 border-background">
    <sng-avatar-image src="user2.jpg" alt="User 2" />
    <sng-avatar-fallback>U2</sng-avatar-fallback>
  </sng-avatar>
  <sng-avatar class="border-2 border-background">
    <sng-avatar-fallback>+5</sng-avatar-fallback>
  </sng-avatar>
</div>
```

## Status Indicator

```html
<div class="relative inline-block">
  <sng-avatar>
    <sng-avatar-image src="user.jpg" alt="User" />
    <sng-avatar-fallback>US</sng-avatar-fallback>
  </sng-avatar>
  <!-- Online indicator -->
  <span class="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-background"></span>
</div>
```

---

# SngAvatar Technical Reference

## Component Architecture

```typescript
// 3 components in compound pattern:
// 1. SngAvatar         - Root container, tracks child image load state
// 2. SngAvatarImage    - Image element with load/error state signals
// 3. SngAvatarFallback - Fallback content shown when image not loaded
```

Compound component for displaying user images with automatic fallback handling. No CDK dependencies. Simple presentational component using Angular signals. Customize sizes via Tailwind `class` input.

## API Reference

```typescript
// SngAvatar - Root Container
// interface SngAvatarApi {
//   class: InputSignal<string>;           // Default: '' - Tailwind classes for sizing
//   imageLoaded: Signal<boolean>;         // true when child image has loaded
// }
// Default size: size-10 (40px). Override via class="size-16" etc.

// SngAvatarImage - Image Element
// interface SngAvatarImageApi {
//   src: InputSignal<string>;             // REQUIRED - Image URL
//   alt: InputSignal<string>;             // Default: '' - Alt text
//   class: InputSignal<string>;           // Default: ''
//   loaded: WritableSignal<boolean>;      // Default: false
//   error: WritableSignal<boolean>;       // Default: false
// }

// SngAvatarFallback - Fallback Content
// interface SngAvatarFallbackApi {
//   class: InputSignal<string>;           // Default: ''
//   shouldShow: Signal<boolean>;          // true when fallback should be visible
// }
```

## Import Requirements

```typescript
// import {
//   SngAvatar,
//   SngAvatarImage,
//   SngAvatarFallback
// } from 'sng-ui';
//
// @Component({
//   standalone: true,
//   imports: [SngAvatar, SngAvatarImage, SngAvatarFallback],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class MyComponent { }
```

## Component Selectors

```typescript
// All components use element selectors
// selector: 'sng-avatar'
// selector: 'sng-avatar-image'
// selector: 'sng-avatar-fallback'

// Usage:
// <sng-avatar>
//   <sng-avatar-image src="..." />
//   <sng-avatar-fallback>JD</sng-avatar-fallback>
// </sng-avatar>
```

## State Management

```typescript
// Image load state flow:
// 1. SngAvatarImage renders <img> with (load) and (error) handlers
// 2. On successful load: loaded.set(true), error.set(false)
// 3. On failed load: loaded.set(false), error.set(true)
// 4. Parent SngAvatar accesses child via contentChild(SngAvatarImage)
// 5. SngAvatarFallback injects parent SngAvatar to read imageLoaded()

// Parent-child communication:
// SngAvatar reads child:
// private imageChild = contentChild(SngAvatarImage);
// imageLoaded = computed(() => this.imageChild()?.loaded() ?? false);

// SngAvatarFallback reads parent:
// private avatar = inject(SngAvatar, { optional: true });
// shouldShow = computed(() => !this.avatar?.imageLoaded() ?? true);
```

## Visibility Logic

```typescript
// SngAvatarImage visibility:
// host: {
//   '[style.display]': 'loaded() ? null : "none"',
// }
// Hidden until image loads successfully

// SngAvatarFallback visibility:
// host: {
//   '[style.display]': 'shouldShow() ? "flex" : "none"',
// }
// shouldShow = computed(() => {
//   if (!this.avatar) return true;  // No parent = always show
//   return !this.avatar.imageLoaded();  // Show when image not loaded
// });
```

## Styling System

```typescript
// Base classes (hardcoded in hostClasses computed):
// SngAvatar: 'relative flex shrink-0 overflow-hidden rounded-full size-10 text-base'
// SngAvatarImage: 'aspect-square size-full'
// SngAvatarFallback: 'flex size-full items-center justify-center rounded-full bg-muted select-none'

// Size customization via class input on root:
// <sng-avatar class="size-16">  // 64px avatar
// <sng-avatar class="size-6 text-xs">  // 24px avatar with smaller text
```

## CDK Usage

```typescript
// NONE - Avatar is a simple presentational component
// No overlay positioning
// No focus management
// No focus navigation
// No portal rendering
// Just styled containers + image load state
```

## Edge Cases & Constraints

```typescript
// 1. IMAGE URL INVALID
// onError() called -> error=true, loaded=false -> fallback shows

// 2. NO IMAGE COMPONENT
// imageChild() returns undefined
// imageLoaded = computed(() => this.imageChild()?.loaded() ?? false);
// Returns false -> fallback always visible

// 3. NO FALLBACK COMPONENT
// Empty space shown when image fails to load
// Always include fallback for good UX

// 4. IMAGE SRC CHANGES
// New src triggers new load attempt
// loaded resets on each load/error

// 5. FALLBACK WITHOUT PARENT
// inject(SngAvatar, { optional: true }) returns null
// shouldShow() returns true -> fallback always visible

// 6. MULTIPLE IMAGES
// Only first SngAvatarImage tracked via contentChild()
// Use single image per avatar
```

## Size Reference

```typescript
// Tailwind size classes:
// size-6  = 24px (extra small)
// size-8  = 32px (small)
// size-10 = 40px (default)
// size-12 = 48px (large)
// size-16 = 64px (extra large)
// size-20 = 80px

// Apply to root avatar only:
// <sng-avatar class="size-16">
// Children (image, fallback) use size-full to fill parent
```

## Do's and Don'ts

### Do
- Always provide `alt` text for accessibility
- Use 2-letter initials for text fallback (first + last name)
- Apply size class to root `<sng-avatar>` component
- Include fallback content for every avatar
- Use `border-background` for avatar groups with overlap
- Wrap avatar in button/link if clickable (not on avatar itself)

### Don't
- Don't use `className` (React convention) - use `class`
- Don't add click handlers directly to avatar components
- Don't skip fallback - users see empty circle on error
- Don't apply size to image/fallback - they inherit from root
- Don't use avatar for non-user images (use plain img)

## Common Mistakes

1. **Missing fallback** - Image fails silently, user sees empty circle. Always provide `<sng-avatar-fallback>`.

2. **Using className** - React convention. Angular uses `class` input.

3. **Size on wrong component** - Apply size class to `<sng-avatar>`, not to image or fallback.

4. **Click handler on avatar** - Avatar is presentational. Wrap in `<button>` or `<a>` for interactivity.

5. **Missing alt text** - `alt=""` is valid for decorative avatars, but most need descriptive text.

6. **Using npm install** - Use `npx @shadng/sng-ui add avatar` (copy-paste model).

## Accessibility Summary

### Automatic Behavior
- Image has `alt` attribute (from input)
- Fallback is decorative (no ARIA role needed)

### Manual Requirements
- Provide meaningful `alt` text for informative avatars
- Use `alt=""` for decorative avatars
- Wrap in focusable element if interactive

### No Focus Navigation
- Avatar is not interactive by default
- No focus management needed
- Wrap in button/link if clickable

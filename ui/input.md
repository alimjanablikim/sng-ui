# ShadNG Input

Angular input components for forms. ShadNG provides a family of specialized input components, each optimized for its use case.

## Input Components

| Component | Use Case |
|-----------|----------|
| `<sng-input>` | Standard text fields (text, email, password, number, date, etc.) |
| `<sng-otp-input>` | Verification codes with individual character slots |
| `<sng-file-input>` | File uploads with button or dropzone mode |
| `<sng-search-input>` | Search boxes with dropdown results or command palette |

## Installation

```bash
npx @shadng/sng-ui add input
```

## Basic Usage

```html
<!-- Standard input -->
<sng-input type="email" placeholder="Email" [(value)]="email" />

<!-- OTP input -->
<sng-otp-input [(value)]="otpCode" [maxLength]="6">
  <sng-otp-input-group>
    <sng-otp-input-slot [index]="0" />
    <sng-otp-input-slot [index]="1" />
    <sng-otp-input-slot [index]="2" />
    <sng-otp-input-slot [index]="3" />
    <sng-otp-input-slot [index]="4" />
    <sng-otp-input-slot [index]="5" />
  </sng-otp-input-group>
</sng-otp-input>

<!-- File input -->
<sng-file-input [(files)]="selectedFiles" />
<sng-file-input dropzone multiple accept="image/*" />

<!-- Search input with dropdown -->
<sng-search-input [(value)]="query" placeholder="Search...">
  <sng-search-input-list>
    <sng-search-input-group heading="Results">
      <sng-search-input-item value="item1">Item 1</sng-search-input-item>
    </sng-search-input-group>
  </sng-search-input-list>
</sng-search-input>
```

---

# SngInput Technical Reference

Complete reference for implementing input components. Each component is purpose-built for its specific use case.

## Component Architecture

```typescript
// 4 main components + sub-components:
// 1. SngInput - Standard text input (element selector)
// 2. SngOtpInput - OTP with slots (+ Group, Slot, Separator)
// 3. SngFileInput - File upload (button or dropzone)
// 4. SngSearchInput - Search with dropdown (+ List, Group, Item, etc.)
```

## SngInput (Standard Input)

```typescript
// projects/sng-ui/src/lib/input/sng-input.ts
import { Component, input, model, computed } from '@angular/core';
import { cn } from './cn';

export type SngInputType =
  | 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  | 'date' | 'time' | 'datetime-local';

@Component({
  selector: 'sng-input',
  standalone: true,
  host: { 'class': 'contents' },
  template: `
    <input
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [value]="value()"
      [class]="inputClasses()"
      (input)="onInput($event)"
    />
  `,
})
export class SngInput {
  type = input<SngInputType>('text');
  placeholder = input<string>('');
  disabled = input(false, { transform: booleanAttribute });
  class = input<string>('');
  value = model<string | number>('');

  inputClasses = computed(() =>
    cn(
      'flex w-full min-w-0 rounded-md border border-input bg-transparent',
      'h-9 text-sm px-3 py-1',
      'shadow-xs transition-[color,box-shadow] outline-none',
      'placeholder:text-muted-foreground',
      'focus-visible:ring-1 focus-visible:ring-ring',
      'disabled:opacity-50',
      this.class()
    )
  );

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
```

## SngOtpInput (Verification Codes)

```typescript
// projects/sng-ui/src/lib/otp-input/sng-otp-input.ts
@Component({
  selector: 'sng-otp-input',
  template: `
    <input type="text" [value]="value()" class="sr-only" />
    <ng-content select="sng-otp-input-group, sng-otp-input-slot, sng-otp-input-separator" />
  `,
})
export class SngOtpInput {
  maxLength = input<number>(6);
  pattern = input<RegExp>(REGEXP_ONLY_DIGITS);
  disabled = input(false);
  value = model<string>('');
  complete = output<string>();
}

// Sub-components:
// - sng-otp-input-group: Visual grouping
// - sng-otp-input-slot: Individual character display
// - sng-otp-input-separator: Dash between groups
```

## SngFileInput (File Uploads)

```typescript
// projects/sng-ui/src/lib/file-input/sng-file-input.ts
@Component({
  selector: 'sng-file-input',
  template: `
    @if (dropzone()) {
      <!-- Drag & drop area -->
    } @else {
      <!-- Button mode -->
    }
  `,
})
export class SngFileInput {
  dropzone = input(false);
  multiple = input(false);
  accept = input<string>('');
  showFileList = input(true);
  disabled = input(false);
  files = model<File[]>([]);
  filesChange = output<File[]>();
}
```

## SngSearchInput (Search with Dropdown)

```typescript
// projects/sng-ui/src/lib/search-input/sng-search-input.ts
@Component({
  selector: 'sng-search-input',
  template: `
    <div cdkOverlayOrigin>
      <input [value]="value()" />
    </div>
    <ng-template cdkConnectedOverlay>
      <ng-content />
    </ng-template>
  `,
})
export class SngSearchInput {
  command = input(false);  // Command palette style (no search icon)
  showClearButton = input(true);
  disabled = input(false);
  value = model<string>('');
  cleared = output<void>();
}

// Sub-components:
// - sng-search-input-list: Container for items
// - sng-search-input-group: Group with heading
// - sng-search-input-item: Selectable item
// - sng-search-input-empty: Empty state message
// - sng-search-input-separator: Visual separator
// - sng-search-input-shortcut: Focus shortcut hint
```

## Usage Examples

### Standard Input with Label
```html
<div class="grid w-full max-w-sm gap-1.5">
  <label for="email" class="text-sm font-medium">Email</label>
  <sng-input type="email" id="email" placeholder="you@example.com" />
</div>
```

### Input Sizes
```html
<!-- Small -->
<sng-input class="h-8 text-xs px-2.5" placeholder="Small" />

<!-- Default -->
<sng-input placeholder="Default" />

<!-- Large -->
<sng-input class="h-10 text-base px-4" placeholder="Large" />
```

### OTP with Separator (XXX-XXX)
```html
<sng-otp-input [(value)]="code" [maxLength]="6" (complete)="onVerify($event)">
  <sng-otp-input-group>
    <sng-otp-input-slot [index]="0" />
    <sng-otp-input-slot [index]="1" />
    <sng-otp-input-slot [index]="2" />
  </sng-otp-input-group>
  <sng-otp-input-separator />
  <sng-otp-input-group>
    <sng-otp-input-slot [index]="3" />
    <sng-otp-input-slot [index]="4" />
    <sng-otp-input-slot [index]="5" />
  </sng-otp-input-group>
</sng-otp-input>
```

### File Dropzone
```html
<sng-file-input dropzone multiple accept="image/*" (filesChange)="onFiles($event)" />
```

### Command Palette
```html
<sng-search-input command placeholder="Type a command...">
  <sng-search-input-list>
    <sng-search-input-group heading="Actions">
      <sng-search-input-item value="copy" (selected)="onSelect($event)">
        Copy
        <sng-search-input-shortcut>Ctrl+C</sng-search-input-shortcut>
      </sng-search-input-item>
    </sng-search-input-group>
  </sng-search-input-list>
</sng-search-input>
```

## Do's and Don'ts
### Do
- Use SngInput for standard form fields (text, email, password, number)
- Use SngOtpInput for verification codes
- Use SngFileInput for file uploads
- Use SngSearchInput for search with dropdown suggestions
- Always associate labels with inputs for accessibility
- Use [(value)] for two-way binding

### Don't
- Use SngInput for OTP, files, or search with dropdown (use dedicated components)
- Forget labels - they're essential for accessibility
- Use placeholder as a replacement for labels
- Skip validation styling - users need feedback

## Accessibility Summary
- SngInput uses native input element - all standard features work
- SngOtpInput supports focus navigation (arrows, backspace, paste)
- SngFileInput handles focus activation of file picker
- SngSearchInput supports arrow key navigation in dropdown
- All components use proper ARIA attributes
- Focus-visible ring for focus navigation

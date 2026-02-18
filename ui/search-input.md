# ShadNG Search Input

Angular search input with dropdown results or command-style filtering.

## Installation

```bash
npx @shadng/sng-ui add search-input
```

## Basic Usage

```html
<!-- Search mode -->
<label for="search-demo" class="sr-only">Search</label>
<sng-search-input id="search-demo" name="search-demo" [(value)]="query" placeholder="Search...">
  <sng-search-input-list>
    <sng-search-input-group heading="Results">
      <sng-search-input-item value="item1" (selected)="onSelect($event)">
        Result 1
      </sng-search-input-item>
      <sng-search-input-item value="item2" (selected)="onSelect($event)">
        Result 2
      </sng-search-input-item>
    </sng-search-input-group>
  </sng-search-input-list>
  <sng-search-input-empty>No results found.</sng-search-input-empty>
</sng-search-input>

<!-- Command mode -->
<label for="command-search-demo" class="sr-only">Command Search</label>
<sng-search-input id="command-search-demo" name="command-search-demo" command [(value)]="commandQuery">
  <sng-search-input-list>
    <sng-search-input-group heading="Actions">
      <sng-search-input-item value="copy" (selected)="onCopy()">Copy</sng-search-input-item>
    </sng-search-input-group>
  </sng-search-input-list>
</sng-search-input>
```

---

# SngSearchInput Technical Reference

Complete reference for implementing search input with grouped items and filtered results.

## Component Architecture

```typescript
// 7 components (standalone):
// 1. SngSearchInput - Main input and content container
// 2. SngSearchInputList - Container for items
// 3. SngSearchInputGroup - Groups items with optional heading
// 4. SngSearchInputItem - Selectable item
// 5. SngSearchInputEmpty - Empty state message
// 6. SngSearchInputSeparator - Visual separator
// 7. SngSearchInputShortcut - Optional trailing hint text
```

## Implementation Notes

```typescript
// projects/sng-ui/src/lib/search-input/sng-search-input.ts
import { Component, input, model, output, signal, computed } from '@angular/core';

@Component({
  selector: 'sng-search-input',
  standalone: true,
})
export class SngSearchInput {
  command = input(false);
  inline = input(false);
  maxRecent = input(0);
  showClearButton = input(true);

  id = input<string>();
  name = input<string>();
  autofocus = input(false);

  value = model<string>('');
  cleared = output<void>();
}
```

## Search Mode vs Command Mode

```html
<!-- Search mode: items hidden until user types -->
<sng-search-input placeholder="Search products...">

<!-- Command mode: items visible by default and filtered as user types -->
<sng-search-input command placeholder="Type a command or search...">
```

The search icon is always visible in both modes.

## Filtering and Selection

The component provides built-in filtering using projected items:

```html
<sng-search-input [(value)]="query">
  <sng-search-input-list>
    <sng-search-input-group heading="Results">
      <sng-search-input-item value="item1" (selected)="navigate($event)">
        Result 1
      </sng-search-input-item>
      <sng-search-input-item value="item2" (selected)="navigate($event)">
        Result 2
      </sng-search-input-item>
    </sng-search-input-group>
  </sng-search-input-list>
</sng-search-input>
```

For dynamic data, render items with `@for` and your own filtered source.

## Do's and Don'ts

### Do
- Provide a real `<label>` for each search input instance
- Use `command` mode for always-visible item lists
- Group related items with headings and separators
- Use `initiallyHidden` for advanced items revealed only by filtering
- Use `maxRecent` to control remembered selections
- Use `inline` when embedding inside dialog content

### Don't
- Render very long ungrouped lists
- Skip handling `(selected)` output
- Rely on placeholder text as the only accessible label

## Accessibility

- Input has combobox/listbox ARIA roles
- Input supports `id`, `name`, and `autofocus` attributes
- Groups with no visible items auto-hide with headings and separators

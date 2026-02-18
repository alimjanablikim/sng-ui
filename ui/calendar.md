
# ShadNG Calendar

Date selection component with single and range modes. Built with Angular signals and Tailwind CSS. Compose with Popover for date picker functionality.

## Installation

```bash
npx @shadng/sng-ui add calendar
```

## Basic Calendar

Inline date selection component with single and range modes:

```html
<sng-calendar
  [selected]="selectedDate()"
  (dateSelected)="onDateSelected($event)"
/>
```

```typescript
selectedDate = signal<Date | null>(null);

onDateSelected(date: Date): void {
  this.selectedDate.set(date);
}
```

## Range Selection

```html
<sng-calendar
  mode="range"
  [selectedRange]="dateRange()"
  (rangeSelected)="onRangeSelected($event)"
/>
```

```typescript
import { type DateRange } from 'sng-ui';

dateRange = signal<DateRange | null>(null);

onRangeSelected(range: DateRange): void {
  this.dateRange.set(range);
  console.log('From:', range.from, 'To:', range.to);
}
```

## Multiple Months

```html
<sng-calendar
  [numberOfMonths]="2"
  [selected]="selectedDate()"
  (dateSelected)="onDateSelected($event)"
/>
```

## Date Picker

Compose a date picker using Popover and Calendar:

```html
<sng-popover #datePicker>
  <sng-popover-trigger>
    <button class="flex h-10 w-[276px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
      <span [class]="selectedDate() ? 'text-foreground' : 'text-muted-foreground'">
        {{ displayValue() }}
      </span>
      <svg class="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
      </svg>
    </button>
  </sng-popover-trigger>
  <sng-popover-content class="w-auto p-0">
    <sng-calendar
      [selected]="selectedDate()"
      (dateSelected)="datePicker.hide(); onDateSelected($event)"
    />
  </sng-popover-content>
</sng-popover>
```

```typescript
import { Component, signal, computed } from '@angular/core';
import { SngPopover, SngPopoverTrigger, SngPopoverContent, SngCalendar } from 'sng-ui';

@Component({
  imports: [SngPopover, SngPopoverTrigger, SngPopoverContent, SngCalendar],
  template: `...`
})
export class DatePickerComponent {
  selectedDate = signal<Date | null>(null);

  displayValue = computed(() => {
    const date = this.selectedDate();
    return date
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Select a date';
  });

  onDateSelected(date: Date) {
    this.selectedDate.set(date);
  }
}
```

## Date Range Picker

Compose a date range picker with a two-month calendar in range mode:

```html
<sng-popover #rangePicker>
  <sng-popover-trigger>
    <button class="flex h-10 w-[320px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
      {{ displayValue() }}
    </button>
  </sng-popover-trigger>
  <sng-popover-content class="w-auto p-0">
    <sng-calendar
      mode="range"
      [numberOfMonths]="2"
      [selectedRange]="selectedRange()"
      (rangeSelected)="rangePicker.hide(); onRangeSelected($event)"
    />
  </sng-popover-content>
</sng-popover>
```

## Date Constraints

```html
<!-- Min/max date range -->
<sng-calendar
  [minDate]="minDate"
  [maxDate]="maxDate"
  [selected]="selectedDate()"
  (dateSelected)="onDateSelected($event)"
/>

<!-- Date picker with constraints -->
<sng-popover #datePicker>
  <sng-popover-trigger>
    <button>{{ displayValue() }}</button>
  </sng-popover-trigger>
  <sng-popover-content class="w-auto p-0">
    <sng-calendar
      [selected]="constrainedDate()"
      [minDate]="minDate"
      [maxDate]="maxDate"
      (dateSelected)="datePicker.hide(); onDateSelected($event)"
    />
  </sng-popover-content>
</sng-popover>
```

```typescript
minDate = new Date(); // Today
maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days out
```

## Custom Disabled Dates

```html
<sng-popover #datePicker>
  <sng-popover-trigger>
    <button>{{ displayValue() }}</button>
  </sng-popover-trigger>
  <sng-popover-content class="w-auto p-0">
    <sng-calendar
      [selected]="date()"
      [isDateDisabled]="isWeekend"
      (dateSelected)="datePicker.hide(); onDateSelected($event)"
    />
  </sng-popover-content>
</sng-popover>
```

```typescript
isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
```

## Custom Date Formatting

Use `Intl.DateTimeFormat` in your `computed()` display value:

```typescript
// Long format
displayValue = computed(() => {
  const date = this.selectedDate();
  return date
    ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'Long format';
});

// Numeric format
displayValue = computed(() => {
  const date = this.selectedDate();
  return date
    ? date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
    : 'Numeric format';
});

// Different locale
displayValue = computed(() => {
  const date = this.selectedDate();
  return date
    ? date.toLocaleDateString('de-DE', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Datum auswaehlen';
});
```

## Today Button

```html
<sng-calendar
  [showTodayButton]="true"
  [selected]="selectedDate()"
  (dateSelected)="onDateSelected($event)"
/>
```

## Forms Integration

Use Angular signals for form state management:

```typescript
import { Component, signal, computed } from '@angular/core';
import { SngPopover, SngPopoverTrigger, SngPopoverContent, SngCalendar } from 'sng-ui';

@Component({
  imports: [SngPopover, SngPopoverTrigger, SngPopoverContent, SngCalendar],
  template: `
    <sng-popover #datePicker>
      <sng-popover-trigger>
        <button>{{ displayValue() }}</button>
      </sng-popover-trigger>
      <sng-popover-content class="w-auto p-0">
        <sng-calendar
          [selected]="selectedDate()"
          (dateSelected)="datePicker.hide(); onDateSelected($event)"
        />
      </sng-popover-content>
    </sng-popover>
  `
})
export class MyComponent {
  selectedDate = signal<Date | null>(null);

  displayValue = computed(() => {
    const date = this.selectedDate();
    return date
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Select a date';
  });

  onDateSelected(date: Date) {
    this.selectedDate.set(date);
  }
}
```

# Calendar Technical Reference

High-signal technical documentation for AI coding assistants. No CDK dependency for calendar. Use SngPopover (CDK Overlay) for date picker composition.

## Component Architecture

```typescript
// 1 component (standalone):
// SngCalendar - Inline date selection with month/year navigation, single/range modes
// Date picker = SngPopover + SngPopoverTrigger + SngPopoverContent + SngCalendar (composition)
```

## Component Interfaces

```typescript
// SngCalendar - Inline calendar component
interface SngCalendarApi {
  // INPUTS (all via input())
  class: InputSignal<string>;                              // Default: ''
  numberOfMonths: InputSignal<number>;                     // Default: 1
  mode: InputSignal<'single' | 'range'>;                   // Default: 'single'
  selected: InputSignal<Date | null>;                      // For single mode
  selectedRange: InputSignal<DateRange | null>;            // For range mode
  minYear: InputSignal<number>;                            // Default: currentYear - 100
  maxYear: InputSignal<number>;                            // Default: currentYear + 10
  minDate: InputSignal<Date | null>;                       // Dates before disabled
  maxDate: InputSignal<Date | null>;                       // Dates after disabled
  isDateDisabled: InputSignal<((date: Date) => boolean) | null>;
  showTodayButton: InputSignal<boolean>;                   // Default: false
  todayLabel: InputSignal<string>;                         // Default: 'Today'
  locale: InputSignal<string>;                             // Default: 'en-US'
  weekStartsOn: InputSignal<number>;                       // Default: 0 (Sunday)
  dir: InputSignal<'ltr' | 'rtl'>;                         // Default: 'ltr'
  showOutsideDays: InputSignal<boolean>;                   // Default: false
  fixedWeeks: InputSignal<boolean>;                        // Default: true

  // OUTPUTS (all via output())
  dateSelected: OutputEmitterRef<Date>;                    // Single mode selection
  rangeSelected: OutputEmitterRef<DateRange>;              // Range mode selection

  // INTERNAL STATE (signals)
  private currentMonth: WritableSignal<Date>;
  private rangeStart: WritableSignal<Date | null>;

  // COMPUTED
  hostClasses: Signal<string>;
  monthOffsets: Signal<number[]>;
  calendarDaysCache: Signal<CalendarDay[][]>;              // Memoized

  // PUBLIC METHODS
  previousMonth(): void;
  nextMonth(): void;
  selectDate(day: CalendarDay): void;
  goToToday(): void;
}
```

## TypeScript Types

```typescript
/**
 * Date range with inclusive start/end dates.
 * Exported from 'sng-ui' for consumer use.
 */
export interface DateRange {
  /** Start date of range (inclusive). Null when range incomplete. */
  from: Date | null;
  /** End date of range (inclusive). Null when range incomplete. */
  to: Date | null;
}

/** Internal day representation for calendar grid */
interface CalendarDay {
  date: number;              // Day of month (1-31)
  isCurrentMonth: boolean;   // False for prev/next month padding
  isToday: boolean;          // Current date indicator
  isDisabled: boolean;       // Computed from constraints
  fullDate: Date;            // Complete Date object
}

/** Selection mode */
type SngCalendarMode = 'single' | 'range';
```

## CDK Assessment

```typescript
// SngCalendar: NO CDK NEEDED
// - No overlay/modal positioning (calendar is inline)
// - Date manipulation is vanilla JS Date

// Date picker composition: uses SngPopover (CDK Overlay)
// - SngPopover handles popup positioning, backdrop, close on click outside
// - Call datePicker.hide() on dateSelected to close after selection
```

## Import Requirements

```typescript
// Calendar only
import { SngCalendar, type DateRange } from 'sng-ui';

// Date picker composition (Popover + Calendar)
import { SngPopover, SngPopoverTrigger, SngPopoverContent, SngCalendar } from 'sng-ui';

@Component({
  standalone: true,
  imports: [SngPopover, SngPopoverTrigger, SngPopoverContent, SngCalendar],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  selectedDate = signal<Date | null>(null);
  dateRange = signal<DateRange | null>(null);
}
```

## Selection Mode Behavior

```typescript
// SINGLE MODE (default)
// - Click date -> dateSelected emits
// - Click different date -> dateSelected emits new date
// - No internal selection state (controlled via selected input)

mode="single"
[selected]="date()"
(dateSelected)="date.set($event)"

// RANGE MODE
// - First click: sets internal rangeStart signal
// - Second click: emits rangeSelected with { from, to }
// - Dates auto-ordered (from < to guaranteed)
// - rangeStart cleared after emission

mode="range"
[selectedRange]="range()"
(rangeSelected)="range.set($event)"
```

## Date Constraint Logic

```typescript
// Constraint evaluation order (short-circuit):
private checkDateDisabled(date: Date): boolean {
  const min = this.minDate();
  const max = this.maxDate();
  const customFn = this.isDateDisabled();

  // 1. Check minDate (inclusive - same day allowed)
  if (min && date < this.startOfDay(min)) return true;

  // 2. Check maxDate (inclusive - same day allowed)
  if (max && date > this.endOfDay(max)) return true;

  // 3. Check custom function
  if (customFn && customFn(date)) return true;

  return false;
}
```

## Date Formatting (Composition Pattern)

```typescript
// Date formatting is handled in the consumer component using computed()
// Use Intl.DateTimeFormat for locale-aware formatting

// Common format options:
{ month: 'short', day: 'numeric', year: 'numeric' }    // "Jan 15, 2025"
{ month: 'long', day: 'numeric', year: 'numeric' }     // "January 15, 2025"
{ year: 'numeric', month: '2-digit', day: '2-digit' }  // "01/15/2025"
{ weekday: 'long', month: 'long', day: 'numeric' }     // "Wednesday, January 15"

// Example computed display value:
displayValue = computed(() => {
  const date = this.selectedDate();
  return date
    ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Select a date';
});
```

## Edge Cases & Constraints

```typescript
// 1. DATE COMPARISON IS DAY-LEVEL
// Time components normalized via startOfDay/endOfDay
// Same calendar day = same date regardless of time

// 2. RANGE AUTO-ORDERING
// { from, to } always has from <= to
// Implementation swaps if user selects end before start

// 3. CLOSE ON SELECT (composition pattern)
// Call datePicker.hide() in (dateSelected) handler to close after selection
// Omit hide() call to keep popover open after selection

// 4. CLEAR BUTTON (composition pattern)
// Add inline clear button in trigger with (click)="clear($event)"
// Use event.stopPropagation() to prevent popover toggle

// 5. YEAR DROPDOWN RANGE
// Default: currentYear - 100 to currentYear + 10
// Configure via minYear/maxYear inputs
// Don't confuse with minDate/maxDate (constraint validation)

// 6. LOCALE AND WEEK START (configurable)
// Configure via locale input (default: 'en-US')
// Configure week start via weekStartsOn: 0=Sun, 1=Mon, etc. (default: 0)
// Calendar uses Intl.DateTimeFormat for localization

// 7. TODAY BUTTON BEHAVIOR
// Navigates to today's month AND selects today (single mode)
// Respects isDateDisabled - no-op if today disabled
// Range mode: only navigates, doesn't select
```

## Do's and Don'ts

### Do
- Use `mode="range"` with `numberOfMonths="2"` for date range UX
- Combine `minDate` + `maxDate` for booking windows
- Use `isDateDisabled` for business rules (weekends, holidays)
- Keep calendar visible for booking/availability interfaces
- Import `DateRange` type for strict typing
- Use `showTodayButton` for navigation convenience
- Compose `SngPopover` + `SngCalendar` for date picker functionality
- Use `computed()` for display value formatting
- Call `datePicker.hide()` on `dateSelected` to close on select
- Use `event.stopPropagation()` on clear button to prevent popover toggle
- Use semantic `locale` matching your users' expectations

### Don't
- Use for time selection (this is date-only)
- Expect `isDateDisabled` to be called lazily (called for all visible dates)
- Modify `selected`/`selectedRange` without handling the output event
- Forget to set `weekStartsOn` if your locale expects Monday start (default is Sunday)
- Confuse `minYear`/`maxYear` (dropdown range) with `minDate`/`maxDate` (validation)
- Put critical date constraints only in UI - validate on server too

## Common Mistakes

1. **Wrong mode for output** - `dateSelected` only emits in single mode, `rangeSelected` only in range mode.

2. **Time component in comparisons** - Dates are compared at day level. A Date with time 23:59 is still "today".

3. **Using minYear instead of minDate** - `minYear` only affects the year dropdown. Use `minDate` to actually prevent selection of past dates.

4. **Expensive isDateDisabled function** - This function runs for every visible date (~42 per month). Cache holiday lookups, avoid API calls.

5. **Range selection incomplete** - `rangeSelected` only emits after BOTH clicks. First click sets internal state only.

6. **Forgetting to close popover** - Call `datePicker.hide()` in the `(dateSelected)` handler if you want close-on-select behavior.

7. **Locale mismatch** - Setting `locale="en-US"` but formatting with European patterns creates confusion. Match them.

## Accessibility Summary

### Automatic ARIA
- `role="application"` on calendar host
- `role="grid"` on day container
- `aria-label` on each day (full date + state)
- `aria-selected` for selected dates
- `aria-current="date"` for today
- `disabled` attribute on disabled days

### Screen Reader Announcements
- Full date format: "Thursday, January 16, 2025"
- State indicators: "(today)", "(selected)", "(unavailable)"
- Combined: "Thursday, January 16, 2025 (today) (selected)"

import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  signal,
  computed,
  numberAttribute,
  booleanAttribute,
  WritableSignal,
  effect,
} from '@angular/core';
import { cn } from './cn';

/** @internal */
interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
  fullDate: Date;
}

/**
 * Represents a date range with start and end dates.
 */
export interface DateRange {
  /** Start date of the range (inclusive). */
  from: Date | null;
  /** End date of the range (inclusive). */
  to: Date | null;
}

/**
 * Calendar component for date selection.
 *
 * Supports single date and date range selection modes.
 * Features month/year dropdowns and min/max date constraints.
 *
 * @example
 * ```html
 * <!-- Single date selection -->
 * <sng-calendar
 *   [selected]="selectedDate"
 *   (dateSelected)="onDateSelected($event)"
 * />
 *
 * <!-- Date range selection -->
 * <sng-calendar
 *   mode="range"
 *   [selectedRange]="dateRange"
 *   (rangeSelected)="onRangeSelected($event)"
 * />
 *
 * <!-- Multiple months with constraints -->
 * <sng-calendar
 *   [numberOfMonths]="2"
 *   [minDate]="minDate"
 *   [maxDate]="maxDate"
 * />
 * ```
 *
 * @see {@link DateRange} for range selection type
 */
@Component({
  selector: 'sng-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: [`
    :host {
      display: block;
      width: fit-content;
      outline: none;
    }
  `],
  host: {
    'role': 'application',
    '[attr.aria-label]': 'calendarAriaLabel()',
    '[attr.dir]': 'dir()',
  },
  template: `
    <div [class]="hostClasses()">
      <div class="flex gap-4">
        @for (monthOffset of monthOffsets(); track monthOffset) {
          <div style="width: 252px;">
            <!-- Header -->
            <div class="flex items-center justify-between px-1">
              @if (monthOffset === 0) {
                <button
                  type="button"
                  (click)="previousMonth()"
                  [attr.aria-label]="previousMonthAriaLabel()"
                  class="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
              } @else {
                <div class="w-7"></div>
              }
              <div class="flex items-center gap-1">
                <div class="relative inline-flex items-center">
                  <select
                    (change)="onMonthChange($event, monthOffset)"
                    [attr.aria-label]="monthSelectAriaLabel()"
                    class="appearance-none bg-transparent text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md border border-input shadow-xs pl-2 pr-5 py-1"
                  >
                    @for (month of months(); track month.value) {
                      <option [value]="month.value" [selected]="month.value === getMonth(monthOffset)">{{ month.label }}</option>
                    }
                  </select>
                  <svg class="pointer-events-none absolute right-0.5 h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
                <div class="relative inline-flex items-center">
                  <select
                    (change)="onYearChange($event, monthOffset)"
                    [attr.aria-label]="yearSelectAriaLabel()"
                    class="appearance-none bg-transparent text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md border border-input shadow-xs pl-2 pr-5 py-1"
                  >
                    @for (year of years(); track year) {
                      <option [value]="year" [selected]="year === getYear(monthOffset)">{{ year }}</option>
                    }
                  </select>
                  <svg class="pointer-events-none absolute right-0.5 h-4 w-4 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </div>
              </div>
              @if (monthOffset === numberOfMonths() - 1) {
                <button
                  type="button"
                  (click)="nextMonth()"
                  [attr.aria-label]="nextMonthAriaLabel()"
                  class="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              } @else {
                <div class="w-7"></div>
              }
            </div>

            <!-- Weekday headers -->
            <div class="mt-4 grid grid-cols-7 text-center text-xs text-muted-foreground">
              @for (day of weekdays(); track day) {
                <div class="size-9 flex items-center justify-center">{{ day }}</div>
              }
            </div>

            <!-- Day grid -->
            <div class="grid grid-cols-7 place-items-center text-sm" role="grid" (mouseleave)="onGridMouseLeave()">
              @for (day of calendarDaysCache()[monthOffset]; track day.fullDate.getTime()) {
                <button
                  type="button"
                  [class]="getDayClasses(day)"
                  [disabled]="isDayDisabled(day)"
                  [attr.aria-label]="getDateAriaLabel(day)"
                  [attr.aria-selected]="isDateSelected(day)"
                  [attr.aria-current]="day.isToday ? 'date' : null"
                  (click)="selectDate(day)"
                  (mouseenter)="onDayHover(day)"
                >
                  {{ day.date }}
                </button>
              }
            </div>
          </div>
        }
      </div>
      @if (showTodayButton()) {
        <div class="mt-3 border-t pt-3">
          <button
            type="button"
            (click)="goToToday()"
            class="w-full rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            {{ todayLabel() }}
          </button>
        </div>
      }
    </div>
  `,
})
export class SngCalendar {
  // Lazy-initialized signals - getter creates signal on first access (after input binding)
  private _currentMonth?: WritableSignal<Date>;

  // Lazy getter: initializes from inputs on first access, then returns same signal
  private get currentMonth(): WritableSignal<Date> {
    if (!this._currentMonth) {
      const range = this.selectedRange();
      const selected = this.selected();
      let initial: Date;
      if (range?.from) {
        initial = new Date(range.from.getFullYear(), range.from.getMonth(), 1);
      } else if (selected) {
        initial = new Date(selected.getFullYear(), selected.getMonth(), 1);
      } else {
        const now = new Date();
        initial = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      this._currentMonth = signal(initial);
    }
    return this._currentMonth;
  }

  /** Custom CSS classes. */
  class = input<string>('');

  /**
   * Number of months to display side by side.
   */
  numberOfMonths = input(1, { transform: numberAttribute });

  /**
   * Selection mode: 'single' for individual dates, 'range' for date ranges.
   */
  mode = input<'single' | 'range'>('single');

  /**
   * Currently selected date (single mode).
   * Use with `(dateSelected)` for two-way-like binding.
   */
  selected = input<Date | null>(null);

  /**
   * Currently selected date range (range mode).
   * Use with `(rangeSelected)` for two-way-like binding.
   */
  selectedRange = input<DateRange | null>(null);

  /**
   * Minimum year shown in year dropdown.
   */
  minYear = input(new Date().getFullYear() - 100, { transform: numberAttribute });

  /**
   * Maximum year shown in year dropdown.
   */
  maxYear = input(new Date().getFullYear() + 10, { transform: numberAttribute });

  /**
   * Minimum selectable date. Dates before this are disabled.
   */
  minDate = input<Date | null>(null);

  /**
   * Maximum selectable date. Dates after this are disabled.
   */
  maxDate = input<Date | null>(null);

  /**
   * Custom function to determine if a date should be disabled.
   * Return `true` to disable the date.
   */
  isDateDisabled = input<((date: Date) => boolean) | null>(null);

  /**
   * Whether to show a "Today" button below the calendar.
   */
  showTodayButton = input(false, { transform: booleanAttribute });

  /**
   * Locale for formatting weekday and month names.
   * Uses Intl.DateTimeFormat for localization.
   */
  locale = input<string>('en-US');

  /**
   * Day the week starts on: 0 = Sunday, 1 = Monday, etc.
   * Common values: 0 (US), 1 (Europe/ISO), 6 (Middle East).
   */
  weekStartsOn = input(0, { transform: numberAttribute });

  /**
   * Text direction for RTL language support.
   * When set to 'rtl', the calendar layout is mirrored.
   */
  dir = input<'ltr' | 'rtl'>('ltr');

  /**
   * Whether to show days from previous/next months and allow clicking them.
   * When enabled, clicking outside days navigates to that month.
   */
  showOutsideDays = input(false, { transform: booleanAttribute });

  /**
   * Whether to always show 6 weeks (42 days) regardless of month.
   * Prevents layout shifts between months with different row counts.
   */
  fixedWeeks = input(true, { transform: booleanAttribute });

  /**
   * Localized label for the "Today" button.
   */
  todayLabel = input<string>('Today');

  /** Aria label for the calendar container. */
  calendarAriaLabel = input<string>('Calendar');

  /** Aria label for the previous-month navigation button. */
  previousMonthAriaLabel = input<string>('Go to previous month');

  /** Aria label for the next-month navigation button. */
  nextMonthAriaLabel = input<string>('Go to next month');

  /** Aria label for the month selector dropdown. */
  monthSelectAriaLabel = input<string>('Select month');

  /** Aria label for the year selector dropdown. */
  yearSelectAriaLabel = input<string>('Select year');

  /**
   * Emitted when a date is selected (single mode).
   */
  dateSelected = output<Date>();

  /**
   * Emitted when a date range is selected (range mode).
   * Emits after both start and end dates are selected.
   */
  rangeSelected = output<DateRange>();

  constructor() {
    effect(() => {
      const mode = this.mode();
      const range = this.selectedRange();
      const selected = this.selected();
      const inputDate = mode === 'range' ? (range?.to ?? range?.from ?? null) : selected;

      if (!inputDate) return;

      this.currentMonth.set(new Date(inputDate.getFullYear(), inputDate.getMonth(), 1));
    });
  }

  /** Localized weekday names (short form), computed from locale and weekStartsOn */
  weekdays = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), { weekday: 'short' });
    const startDay = this.weekStartsOn();
    // Generate weekday names starting from weekStartsOn
    // Jan 4, 1970 was a Sunday (day 0)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(1970, 0, 4 + ((startDay + i) % 7));
      return formatter.format(date);
    });
  });

  /** Localized month names for dropdown, computed from locale */
  months = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale(), { month: 'short' });
    return Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: formatter.format(new Date(2000, i, 1)),
    }));
  });

  years = computed(() => {
    const years: number[] = [];
    for (let i = this.minYear(); i <= this.maxYear(); i++) {
      years.push(i);
    }
    return years;
  });

  private rangeStart = signal<Date | null>(null);

  private hoveredDate = signal<Date | null>(null);

  hostClasses = computed(() => cn('p-3 rounded-md border shadow-sm', this.class()));

  monthOffsets = computed(() => {
    return Array.from({ length: this.numberOfMonths() }, (_, i) => i);
  });

  /** Memoized calendar days for all month offsets - recalculates only when currentMonth changes */
  calendarDaysCache = computed(() => {
    const offsets = this.monthOffsets();
    return offsets.map(offset => this.computeCalendarDays(offset));
  });

  getMonthYearLabel(offset: number): string {
    const base = this.currentMonth();
    const date = new Date(base.getFullYear(), base.getMonth() + offset, 1);
    return date.toLocaleDateString(this.locale(), { month: 'long', year: 'numeric' });
  }

  private computeCalendarDays(offset: number): CalendarDay[] {
    const base = this.currentMonth();
    const current = new Date(base.getFullYear(), base.getMonth() + offset, 1);
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: CalendarDay[] = [];
    const today = new Date();
    const showOutside = this.showOutsideDays();

    // Days from previous month (accounting for weekStartsOn)
    const firstDayOfWeek = firstDay.getDay();
    const weekStart = this.weekStartsOn();
    const daysFromPrevMonth = (firstDayOfWeek - weekStart + 7) % 7;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const fullDate = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: this.isSameDay(fullDate, today),
        isDisabled: showOutside ? this.checkDateDisabled(fullDate) : true,
        fullDate,
      });
    }

    // Days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday: this.isSameDay(date, today),
        isDisabled: this.checkDateDisabled(date),
        fullDate: date,
      });
    }

    // Days from next month (to fill 6 weeks if fixedWeeks, or just complete the last row)
    const targetDays = this.fixedWeeks() ? 42 : Math.ceil(days.length / 7) * 7;
    const remainingDays = targetDays - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const fullDate = new Date(year, month + 1, i);
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: this.isSameDay(fullDate, today),
        isDisabled: showOutside ? this.checkDateDisabled(fullDate) : true,
        fullDate,
      });
    }

    return days;
  }

  /** Check if a date should be disabled */
  private checkDateDisabled(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    const customFn = this.isDateDisabled();

    // Check minDate
    if (min && date < this.startOfDay(min)) {
      return true;
    }

    // Check maxDate
    if (max && date > this.endOfDay(max)) {
      return true;
    }

    // Check custom function
    if (customFn && customFn(date)) {
      return true;
    }

    return false;
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  getDayClasses(day: CalendarDay): string {
    // Use focus-visible to only show ring when browser applies focus-visible
    const base = 'size-8 rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
    // Selected dates: same ring style (no flicker)
    const selectedBase = 'size-8 rounded-md text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
    const showOutside = this.showOutsideDays();

    if (!day.isCurrentMonth) {
      // Outside days: show faded if showOutsideDays is true, otherwise very faded
      if (showOutside && !day.isDisabled) {
        return `${base} text-muted-foreground hover:bg-accent hover:text-accent-foreground`;
      }
      return `${base} text-muted-foreground/30`;
    }

    // Disabled date styling
    if (day.isDisabled) {
      return `${base} text-muted-foreground/50 cursor-not-allowed`;
    }

    // Cache signal reads once at entry to avoid repeated access
    const mode = this.mode();
    const selected = this.selected();
    const range = this.selectedRange();
    const start = this.rangeStart();
    const hovered = this.hoveredDate();

    // Range selection mode - handle ALL cases here, never fall through
    if (mode === 'range') {
      // When rangeStart is set, we're selecting a new range
      if (start) {
        if (this.isSameDay(day.fullDate, start)) {
          return `${selectedBase} bg-primary text-primary-foreground`;
        }

        // Show hover preview range
        if (hovered && !day.isDisabled) {
          const previewFrom = start < hovered ? start : hovered;
          const previewTo = start < hovered ? hovered : start;
          if (this.isSameDay(day.fullDate, hovered)) {
            return `${selectedBase} bg-primary/70 text-primary-foreground`;
          }
          if (this.isInRange(day.fullDate, previewFrom, previewTo)) {
            return `${base} bg-accent text-accent-foreground`;
          }
        }

        // In selecting mode: today gets bg-accent, others get default
        if (day.isToday) {
          return `${base} bg-accent text-accent-foreground rounded-md`;
        }
        return `${base} hover:bg-accent hover:text-accent-foreground`;
      }

      // Only show complete range when NOT selecting (rangeStart is null)
      if (range?.from && range?.to) {
        if (this.isSameDay(day.fullDate, range.from) || this.isSameDay(day.fullDate, range.to)) {
          return `${selectedBase} bg-primary text-primary-foreground`;
        }
        if (this.isInRange(day.fullDate, range.from, range.to)) {
          return `${base} bg-accent text-accent-foreground`;
        }
      }

      // In range mode: today gets bg-accent indicator
      if (day.isToday) {
        return `${base} bg-accent text-accent-foreground rounded-md`;
      }

      // Default for range mode
      return `${base} hover:bg-accent hover:text-accent-foreground`;
    }

    // Single selection mode
    if (selected && this.isSameDay(day.fullDate, selected)) {
      return `${selectedBase} bg-primary text-primary-foreground`;
    }

    // Single mode: today gets bg-accent indicator
    if (day.isToday) {
      return `${base} bg-accent text-accent-foreground rounded-md`;
    }

    return `${base} hover:bg-accent hover:text-accent-foreground`;
  }

  previousMonth(): void {
    this.currentMonth.update(date => {
      const d = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      return d;
    });
  }

  nextMonth(): void {
    this.currentMonth.update(date => {
      const d = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      return d;
    });
  }

  selectDate(day: CalendarDay): void {
    // Handle outside days: navigate to that month if showOutsideDays is enabled
    if (!day.isCurrentMonth) {
      if (this.showOutsideDays() && !day.isDisabled) {
        // Navigate to the month of the clicked outside day
        this.currentMonth.set(new Date(day.fullDate.getFullYear(), day.fullDate.getMonth(), 1));
        // Continue with selection
      } else {
        return;
      }
    }

    if (day.isDisabled) return;

    if (this.mode() === 'range') {
      const start = this.rangeStart();
      if (!start) {
        // Starting new range selection
        this.rangeStart.set(day.fullDate);
        this.hoveredDate.set(null);
      } else {
        // Completing range selection
        const from = start < day.fullDate ? start : day.fullDate;
        const to = start < day.fullDate ? day.fullDate : start;

        // Validate: prevent ranges spanning disabled dates
        if (this.hasDisabledDatesInRange(from, to)) {
          // Reset and start new range from clicked date
          this.rangeStart.set(day.fullDate);
          this.hoveredDate.set(null);
          return;
        }

        this.rangeSelected.emit({ from, to });
        this.rangeStart.set(null);
        this.hoveredDate.set(null);
      }
    } else {
      this.dateSelected.emit(day.fullDate);
    }
  }

  /** Go to today and select it */
  goToToday(): void {
    const today = new Date();
    if (!this.checkDateDisabled(today)) {
      this.currentMonth.set(new Date(today.getFullYear(), today.getMonth(), 1));
      if (this.mode() === 'single') {
        this.dateSelected.emit(today);
      }
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private isInRange(date: Date, from: Date, to: Date): boolean {
    return date > from && date < to;
  }

  /**
   * Check if there are any disabled dates between two dates (exclusive).
   * Used to prevent range selections that span disabled dates.
   * @internal
   */
  private hasDisabledDatesInRange(from: Date, to: Date): boolean {
    const start = from < to ? from : to;
    const end = from < to ? to : from;
    const current = new Date(start);
    current.setDate(current.getDate() + 1); // Start from day after start

    while (current < end) {
      if (this.checkDateDisabled(current)) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }
    return false;
  }

  getMonth(offset: number): number {
    const base = this.currentMonth();
    return new Date(base.getFullYear(), base.getMonth() + offset, 1).getMonth();
  }

  getYear(offset: number): number {
    const base = this.currentMonth();
    return new Date(base.getFullYear(), base.getMonth() + offset, 1).getFullYear();
  }

  onMonthChange(event: Event, offset: number): void {
    const select = event.target as HTMLSelectElement;
    const newMonth = parseInt(select.value, 10);
    this.currentMonth.update(date => {
      return new Date(date.getFullYear(), newMonth - offset, 1);
    });
  }

  onYearChange(event: Event, offset: number): void {
    const select = event.target as HTMLSelectElement;
    const newYear = parseInt(select.value, 10);
    this.currentMonth.update(date => {
      // The panel at `offset` currently shows month = date.month + offset.
      // Keep that same month but change the year, then subtract offset to get the base.
      const panelMonth = new Date(date.getFullYear(), date.getMonth() + offset, 1).getMonth();
      return new Date(newYear, panelMonth - offset, 1);
    });
  }

  /** Check if a day is selected (for aria-selected) */
  isDateSelected(day: CalendarDay): boolean {
    if (this.mode() === 'range') {
      const range = this.selectedRange();
      if (range?.from && this.isSameDay(day.fullDate, range.from)) return true;
      if (range?.to && this.isSameDay(day.fullDate, range.to)) return true;
      return false;
    }
    const selected = this.selected();
    return selected ? this.isSameDay(day.fullDate, selected) : false;
  }

  /** Get accessible label for a day button */
  getDateAriaLabel(day: CalendarDay): string {
    const date = day.fullDate;
    const formatted = date.toLocaleDateString(this.locale(), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const parts = [formatted];
    if (day.isToday) parts.push('(today)');
    if (this.isDateSelected(day)) parts.push('(selected)');
    if (day.isDisabled) parts.push('(unavailable)');

    return parts.join(' ');
  }

  /** Handle day hover for range preview */
  onDayHover(day: CalendarDay): void {
    if (this.mode() === 'range' && this.rangeStart() && !day.isDisabled) {
      this.hoveredDate.set(day.fullDate);
    }
  }

  /** Clear hover state when leaving the grid */
  onGridMouseLeave(): void {
    this.hoveredDate.set(null);
  }

  /** Check if a day button should be disabled */
  isDayDisabled(day: CalendarDay): boolean {
    // Outside days: disabled unless showOutsideDays is enabled and date isn't disabled
    if (!day.isCurrentMonth) {
      return !this.showOutsideDays() || day.isDisabled;
    }
    return day.isDisabled;
  }
}

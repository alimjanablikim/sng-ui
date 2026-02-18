import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngCalendar } from './sng-calendar';

const meta: Meta<SngCalendar> = {
  title: 'UI/Calendar',
  component: SngCalendar,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range'],
      description: 'Selection mode',
    },
    numberOfMonths: {
      control: 'number',
      description: 'Number of months to display',
    },
    showTodayButton: {
      control: 'boolean',
      description: 'Show today button',
    },
    showOutsideDays: {
      control: 'boolean',
      description: 'Show days from adjacent months',
    },
    fixedWeeks: {
      control: 'boolean',
      description: 'Always show 6 weeks',
    },
    weekStartsOn: {
      control: 'number',
      description: 'Day the week starts on (0=Sunday)',
    },
    locale: {
      control: 'text',
      description: 'Locale for formatting',
    },
    dir: {
      control: 'select',
      options: ['ltr', 'rtl'],
      description: 'Text direction',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-calendar ${argsToTemplate(args)} />`,
  }),
};

export default meta;
type Story = StoryObj<SngCalendar>;

/**
 * Default calendar with single date selection.
 */
export const Default: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 1,
    showTodayButton: false,
    fixedWeeks: true,
  },
};

/**
 * Calendar with date range selection.
 */
export const RangeSelection: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 1,
    showTodayButton: false,
  },
};

/**
 * Calendar showing two months side by side.
 */
export const TwoMonths: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 2,
    showTodayButton: false,
  },
};

/**
 * Calendar with today button.
 */
export const WithTodayButton: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 1,
    showTodayButton: true,
  },
};

/**
 * Calendar showing days from adjacent months.
 */
export const WithOutsideDays: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 1,
    showOutsideDays: true,
  },
};

/**
 * Calendar with week starting on Monday.
 */
export const MondayStart: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 1,
    weekStartsOn: 1,
  },
};

/**
 * Calendar with min/max date constraints.
 */
export const WithConstraints: Story = {
  render: () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 7);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    return {
      props: { minDate, maxDate },
      template: `
        <sng-calendar
          [minDate]="minDate"
          [maxDate]="maxDate"
        />
      `,
    };
  },
};

/**
 * Calendar with custom disabled dates (weekends).
 */
export const DisabledWeekends: Story = {
  render: () => ({
    props: {
      isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    },
    template: `
      <sng-calendar
        [isDateDisabled]="isDateDisabled"
      />
    `,
  }),
};

/**
 * Date range picker with two months.
 */
export const DateRangePicker: Story = {
  args: {
    mode: 'range',
    numberOfMonths: 2,
    showTodayButton: true,
  },
};

/**
 * RTL calendar (Right-to-Left).
 */
export const RtlCalendar: Story = {
  args: {
    mode: 'single',
    numberOfMonths: 1,
    dir: 'rtl',
    locale: 'ar',
  },
};

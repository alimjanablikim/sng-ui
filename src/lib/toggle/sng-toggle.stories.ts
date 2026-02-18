import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngToggle } from './sng-toggle';
import { SngToggleGroup } from './sng-toggle-group';
import { SngToggleGroupItem } from './sng-toggle-group-item';

/**
 * Toggle is a two-state button that can be either on or off.
 *
 * Size is controlled via Tailwind classes: h-8 px-1.5 min-w-8 text-xs (small),
 * h-9 px-2 min-w-9 text-sm (default), h-10 px-2.5 min-w-10 text-base (large).
 */
const meta: Meta<SngToggle> = {
  title: 'UI/Toggle',
  component: SngToggle,
  tags: ['autodocs'],
  argTypes: {
    pressed: {
      control: 'boolean',
      description: 'Whether the toggle is pressed/active',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
    class: {
      control: 'text',
      description: 'Custom CSS classes. Use Tailwind classes to control size.',
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-toggle ${argsToTemplate(args)}>Toggle</sng-toggle>`,
  }),
};

export default meta;
type Story = StoryObj<SngToggle>;

/**
 * Default toggle in unpressed state.
 */
export const Default: Story = {
  args: {
    pressed: false,
    disabled: false,
  },
};

/**
 * Toggle in pressed state.
 */
export const Pressed: Story = {
  args: {
    pressed: true,
    disabled: false,
  },
};

/**
 * Disabled toggle.
 */
export const Disabled: Story = {
  args: {
    pressed: false,
    disabled: true,
  },
};

/**
 * Disabled toggle in pressed state.
 */
export const DisabledPressed: Story = {
  args: {
    pressed: true,
    disabled: true,
  },
};

/**
 * Small size variant.
 */
export const Small: Story = {
  args: {
    pressed: false,
    disabled: false,
    class: 'h-8 px-1.5 min-w-8 text-xs',
  },
};

/**
 * Large size variant.
 */
export const Large: Story = {
  args: {
    pressed: false,
    disabled: false,
    class: 'h-10 px-2.5 min-w-10 text-base',
  },
};

/**
 * All size variants comparison.
 */
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-4">
        <div class="flex flex-col items-center gap-2">
          <sng-toggle class="h-8 px-1.5 min-w-8 text-xs" [pressed]="true">Sm</sng-toggle>
          <span class="text-xs text-muted-foreground">Small</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <sng-toggle [pressed]="true">Default</sng-toggle>
          <span class="text-xs text-muted-foreground">Default</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <sng-toggle class="h-10 px-2.5 min-w-10 text-base" [pressed]="true">Large</sng-toggle>
          <span class="text-xs text-muted-foreground">Large</span>
        </div>
      </div>
    `,
  }),
};

/**
 * Toggle with icon (Bold button example).
 */
export const WithIcon: Story = {
  render: () => ({
    props: { isBold: false },
    template: `
      <sng-toggle [(pressed)]="isBold" aria-label="Toggle bold">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>
        </svg>
      </sng-toggle>
    `,
  }),
};

/**
 * Text formatting toolbar example.
 */
export const FormattingToolbar: Story = {
  render: () => ({
    props: { bold: false, italic: false, underline: false },
    template: `
      <div class="flex items-center gap-1 p-1 border border-input rounded-md bg-background">
        <sng-toggle [(pressed)]="bold" aria-label="Toggle bold" class="h-8 px-1.5 min-w-8 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>
          </svg>
        </sng-toggle>
        <sng-toggle [(pressed)]="italic" aria-label="Toggle italic" class="h-8 px-1.5 min-w-8 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>
          </svg>
        </sng-toggle>
        <sng-toggle [(pressed)]="underline" aria-label="Toggle underline" class="h-8 px-1.5 min-w-8 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/>
          </svg>
        </sng-toggle>
      </div>
    `,
  }),
};

// =============================================================================
// Toggle Group Stories
// =============================================================================

/**
 * Toggle Group - single selection (radio-like behavior).
 */
export const GroupSingle: Story = {
  name: 'Group - Single Selection',
  render: () => ({
    moduleMetadata: {
      imports: [SngToggleGroup, SngToggleGroupItem],
    },
    template: `
      <sng-toggle-group type="single" defaultValue="center">
        <sng-toggle-group-item value="left">Left</sng-toggle-group-item>
        <sng-toggle-group-item value="center">Center</sng-toggle-group-item>
        <sng-toggle-group-item value="right">Right</sng-toggle-group-item>
      </sng-toggle-group>
    `,
  }),
};

/**
 * Toggle Group - multiple selection (checkbox-like behavior).
 */
export const GroupMultiple: Story = {
  name: 'Group - Multiple Selection',
  render: () => ({
    moduleMetadata: {
      imports: [SngToggleGroup, SngToggleGroupItem],
    },
    template: `
      <sng-toggle-group type="multiple" [defaultValue]="['bold']">
        <sng-toggle-group-item value="bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>
          </svg>
        </sng-toggle-group-item>
        <sng-toggle-group-item value="italic">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>
          </svg>
        </sng-toggle-group-item>
        <sng-toggle-group-item value="underline">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/>
          </svg>
        </sng-toggle-group-item>
      </sng-toggle-group>
    `,
  }),
};

/**
 * Toggle Group with disabled item.
 */
export const GroupWithDisabled: Story = {
  name: 'Group - With Disabled Item',
  render: () => ({
    moduleMetadata: {
      imports: [SngToggleGroup, SngToggleGroupItem],
    },
    template: `
      <sng-toggle-group type="single" defaultValue="left">
        <sng-toggle-group-item value="left">Left</sng-toggle-group-item>
        <sng-toggle-group-item value="center" [disabled]="true">Center</sng-toggle-group-item>
        <sng-toggle-group-item value="right">Right</sng-toggle-group-item>
      </sng-toggle-group>
    `,
  }),
};

/**
 * Text alignment toolbar using toggle group.
 */
export const GroupTextAlignment: Story = {
  name: 'Group - Text Alignment Toolbar',
  render: () => ({
    moduleMetadata: {
      imports: [SngToggleGroup, SngToggleGroupItem],
    },
    template: `
      <sng-toggle-group type="single" defaultValue="left">
        <sng-toggle-group-item value="left" aria-label="Align left">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/>
          </svg>
        </sng-toggle-group-item>
        <sng-toggle-group-item value="center" aria-label="Align center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="21" x2="3" y1="6" y2="6"/><line x1="17" x2="7" y1="12" y2="12"/><line x1="19" x2="5" y1="18" y2="18"/>
          </svg>
        </sng-toggle-group-item>
        <sng-toggle-group-item value="right" aria-label="Align right">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/>
          </svg>
        </sng-toggle-group-item>
        <sng-toggle-group-item value="justify" aria-label="Justify">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="3" y1="12" y2="12"/><line x1="21" x2="3" y1="18" y2="18"/>
          </svg>
        </sng-toggle-group-item>
      </sng-toggle-group>
    `,
  }),
};

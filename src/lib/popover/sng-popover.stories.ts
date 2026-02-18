import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngPopover } from './sng-popover';
import { SngPopoverTrigger } from './sng-popover-trigger';
import { SngPopoverContent } from './sng-popover-content';
import { SngButton } from '../button/sng-button';
import { SngInput } from '../input/sng-input';

/**
 * Popover displays floating content anchored to a trigger element.
 *
 * Built on Angular CDK Overlay for reliable positioning.
 * Supports four sides (top, bottom, left, right) with animated transitions.
 */
const meta: Meta<SngPopover> = {
  title: 'UI/Popover',
  component: SngPopover,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of the popover relative to the trigger',
      table: {
        type: { summary: "'top' | 'bottom' | 'left' | 'right'" },
        defaultValue: { summary: 'bottom' },
      },
    },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngPopover, SngPopoverTrigger, SngPopoverContent, SngButton],
    },
    template: `
      <div class="flex items-center justify-center p-20">
        <sng-popover ${argsToTemplate(args)}>
          <sng-popover-trigger><sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Open popover</sng-button></sng-popover-trigger>
          <sng-popover-content>
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Dimensions</h4>
                <p class="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
            </div>
          </sng-popover-content>
        </sng-popover>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<SngPopover>;

/**
 * Default popover appearing below the trigger.
 */
export const Default: Story = {
  args: {
    side: 'bottom',
  },
};

/**
 * Popover appearing above the trigger.
 */
export const Top: Story = {
  args: {
    side: 'top',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngPopover, SngPopoverTrigger, SngPopoverContent, SngButton],
    },
    template: `
      <div class="flex items-center justify-center p-20 pt-40">
        <sng-popover ${argsToTemplate(args)}>
          <sng-popover-trigger><sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Open popover</sng-button></sng-popover-trigger>
          <sng-popover-content>
            <p class="text-sm">This popover appears above the trigger.</p>
          </sng-popover-content>
        </sng-popover>
      </div>
    `,
  }),
};

/**
 * Popover appearing to the left of the trigger.
 */
export const Left: Story = {
  args: {
    side: 'left',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngPopover, SngPopoverTrigger, SngPopoverContent, SngButton],
    },
    template: `
      <div class="flex items-center justify-center p-20 pl-80">
        <sng-popover ${argsToTemplate(args)}>
          <sng-popover-trigger><sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Open popover</sng-button></sng-popover-trigger>
          <sng-popover-content>
            <p class="text-sm">This popover appears to the left.</p>
          </sng-popover-content>
        </sng-popover>
      </div>
    `,
  }),
};

/**
 * Popover appearing to the right of the trigger.
 */
export const Right: Story = {
  args: {
    side: 'right',
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngPopover, SngPopoverTrigger, SngPopoverContent, SngButton],
    },
    template: `
      <div class="flex items-center justify-center p-20 pr-80">
        <sng-popover ${argsToTemplate(args)}>
          <sng-popover-trigger><sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Open popover</sng-button></sng-popover-trigger>
          <sng-popover-content>
            <p class="text-sm">This popover appears to the right.</p>
          </sng-popover-content>
        </sng-popover>
      </div>
    `,
  }),
};

/**
 * Popover with a form for editing dimensions.
 */
export const WithForm: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngPopover,
        SngPopoverTrigger,
        SngPopoverContent,
        SngButton,
        SngInput,
      ],
    },
    template: `
      <div class="flex items-center justify-center p-20">
        <sng-popover>
          <sng-popover-trigger><sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground">Open popover</sng-button></sng-popover-trigger>
          <sng-popover-content class="w-80">
            <div class="grid gap-4">
              <div class="space-y-2">
                <h4 class="font-medium leading-none">Dimensions</h4>
                <p class="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
              <div class="grid gap-2">
                <div class="grid grid-cols-3 items-center gap-4">
                  <label for="width" class="text-sm font-medium">Width</label>
                  <sng-input [id]="'width'" value="100%" class="col-span-2 h-8" />
                </div>
                <div class="grid grid-cols-3 items-center gap-4">
                  <label for="maxWidth" class="text-sm font-medium">Max. width</label>
                  <sng-input [id]="'maxWidth'" value="300px" class="col-span-2 h-8" />
                </div>
                <div class="grid grid-cols-3 items-center gap-4">
                  <label for="height" class="text-sm font-medium">Height</label>
                  <sng-input [id]="'height'" value="25px" class="col-span-2 h-8" />
                </div>
                <div class="grid grid-cols-3 items-center gap-4">
                  <label for="maxHeight" class="text-sm font-medium">Max. height</label>
                  <sng-input [id]="'maxHeight'" value="none" class="col-span-2 h-8" />
                </div>
              </div>
            </div>
          </sng-popover-content>
        </sng-popover>
      </div>
    `,
  }),
};

/**
 * Simple popover with text content.
 */
export const Simple: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngPopover, SngPopoverTrigger, SngPopoverContent, SngButton],
    },
    template: `
      <div class="flex items-center justify-center p-20">
        <sng-popover>
          <sng-popover-trigger><sng-button class="hover:bg-accent hover:text-accent-foreground">Info</sng-button></sng-popover-trigger>
          <sng-popover-content class="w-64">
            <p class="text-sm">
              This is a simple popover with just text content. Click outside to dismiss.
            </p>
          </sng-popover-content>
        </sng-popover>
      </div>
    `,
  }),
};

/**
 * Popover with custom width.
 */
export const CustomWidth: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngPopover, SngPopoverTrigger, SngPopoverContent, SngButton],
    },
    template: `
      <div class="flex items-center justify-center p-20">
        <sng-popover>
          <sng-popover-trigger><sng-button class="bg-secondary text-secondary-foreground hover:bg-secondary/80">Wide Popover</sng-button></sng-popover-trigger>
          <sng-popover-content class="w-96">
            <div class="space-y-2">
              <h4 class="font-medium">Custom Width Popover</h4>
              <p class="text-sm text-muted-foreground">
                This popover uses a custom width class (w-96) for wider content.
                You can use any Tailwind width class or custom CSS.
              </p>
            </div>
          </sng-popover-content>
        </sng-popover>
      </div>
    `,
  }),
};

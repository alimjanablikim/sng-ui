import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngSkeleton } from './sng-skeleton';

/**
 * Skeleton displays a pulsing placeholder for content that is loading.
 *
 * Helps reduce perceived loading time and prevent layout shift.
 * Customize shape via Tailwind classes:
 * - Default: rounded-md (built-in)
 * - Circular: class="rounded-full"
 * - Text line: class="rounded h-4 w-full"
 */
const meta: Meta<SngSkeleton> = {
  title: 'UI/Skeleton',
  component: SngSkeleton,
  tags: ['autodocs'],
  argTypes: {
    class: {
      control: 'text',
      description: 'Custom CSS classes to control dimensions and shape',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `<sng-skeleton ${argsToTemplate(args)} />`,
  }),
};

export default meta;
type Story = StoryObj<SngSkeleton>;

/**
 * Default skeleton with rounded rectangle shape.
 */
export const Default: Story = {
  args: {
    class: 'h-4 w-[250px]',
  },
};

/**
 * Circular skeleton for avatar placeholders.
 * Use class="rounded-full" to achieve circular shape.
 */
export const Circular: Story = {
  args: {
    class: 'h-12 w-12 rounded-full',
  },
};

/**
 * Text skeleton for single-line text placeholders.
 * Use class="rounded h-4 w-full" for text line shape.
 */
export const Text: Story = {
  args: {
    class: 'rounded h-4 w-full',
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 300px;">
        <sng-skeleton ${argsToTemplate(args)} />
      </div>
    `,
  }),
};

/**
 * Card-style skeleton with avatar and text lines.
 */
export const CardSkeleton: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <sng-skeleton class="h-12 w-12 rounded-full" />
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <sng-skeleton class="h-4 w-[250px]" />
          <sng-skeleton class="h-4 w-[200px]" />
        </div>
      </div>
    `,
  }),
};

/**
 * Content placeholder skeleton mimicking article content.
 */
export const ContentSkeleton: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
        <sng-skeleton class="h-6 w-3/4" />
        <sng-skeleton class="h-4 w-full" />
        <sng-skeleton class="h-4 w-full" />
        <sng-skeleton class="h-4 w-2/3" />
      </div>
    `,
  }),
};

/**
 * Image placeholder skeleton with aspect ratio.
 */
export const ImageSkeleton: Story = {
  render: () => ({
    template: `
      <sng-skeleton class="h-[200px] w-[300px] rounded-lg" />
    `,
  }),
};

/**
 * List skeleton with multiple items.
 */
export const ListSkeleton: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <sng-skeleton class="h-10 w-10 rounded-full" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
            <sng-skeleton class="h-4 w-3/4" />
            <sng-skeleton class="h-3 w-1/2" />
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <sng-skeleton class="h-10 w-10 rounded-full" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
            <sng-skeleton class="h-4 w-2/3" />
            <sng-skeleton class="h-3 w-1/3" />
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <sng-skeleton class="h-10 w-10 rounded-full" />
          <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
            <sng-skeleton class="h-4 w-4/5" />
            <sng-skeleton class="h-3 w-2/5" />
          </div>
        </div>
      </div>
    `,
  }),
};

/**
 * All shape variations displayed together for comparison.
 * Shapes are controlled via Tailwind classes on the class input.
 */
export const AllShapes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <p style="font-size: 12px; color: gray; margin-bottom: 8px;">Default (rounded-md)</p>
          <sng-skeleton class="h-8 w-[200px]" />
        </div>
        <div>
          <p style="font-size: 12px; color: gray; margin-bottom: 8px;">Circular (rounded-full)</p>
          <sng-skeleton class="h-12 w-12 rounded-full" />
        </div>
        <div>
          <p style="font-size: 12px; color: gray; margin-bottom: 8px;">Text (full-width line)</p>
          <div style="width: 300px;">
            <sng-skeleton class="rounded h-4 w-full" />
          </div>
        </div>
      </div>
    `,
  }),
};

import { type Meta, type StoryObj, argsToTemplate } from '@storybook/angular';
import { SngAvatar } from './sng-avatar';
import { SngAvatarImage } from './sng-avatar-image';
import { SngAvatarFallback } from './sng-avatar-fallback';

/**
 * Avatar displays a user image with fallback for missing or loading states.
 *
 * Composed of Avatar container, AvatarImage, and AvatarFallback. The fallback
 * is automatically shown when the image is loading or fails to load.
 *
 * Size is controlled via Tailwind classes: size-6 (24px), size-8 (32px),
 * size-10 (40px default), size-12 (48px), size-16 (64px).
 */
const meta: Meta<SngAvatar> = {
  title: 'UI/Avatar',
  component: SngAvatar,
  tags: ['autodocs'],
  argTypes: {
    class: {
      control: 'text',
      description: 'Custom CSS classes to merge with default styles. Use Tailwind size classes (size-6, size-8, size-10, size-12, size-16) to control size.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAvatar, SngAvatarImage, SngAvatarFallback],
    },
    template: `
      <sng-avatar ${argsToTemplate(args)}>
        <sng-avatar-image src="https://avatars.githubusercontent.com/u/9919?v=4" alt="User" />
        <sng-avatar-fallback>CN</sng-avatar-fallback>
      </sng-avatar>
    `,
  }),
};

export default meta;
type Story = StoryObj<SngAvatar>;

/**
 * Default avatar with image (40px).
 */
export const Default: Story = {
  args: {},
};

/**
 * Avatar with fallback initials (shown when no image).
 */
export const WithFallback: Story = {
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAvatar, SngAvatarFallback],
    },
    template: `
      <sng-avatar ${argsToTemplate(args)}>
        <sng-avatar-fallback>JD</sng-avatar-fallback>
      </sng-avatar>
    `,
  }),
};

/**
 * Avatar with broken image URL (shows fallback).
 */
export const BrokenImage: Story = {
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAvatar, SngAvatarImage, SngAvatarFallback],
    },
    template: `
      <sng-avatar ${argsToTemplate(args)}>
        <sng-avatar-image src="https://broken-url.invalid/avatar.jpg" alt="User" />
        <sng-avatar-fallback>FB</sng-avatar-fallback>
      </sng-avatar>
    `,
  }),
};

/**
 * Extra small avatar (24px).
 */
export const ExtraSmall: Story = {
  args: {
    class: 'size-6 text-xs',
  },
};

/**
 * Small avatar (32px).
 */
export const Small: Story = {
  args: {
    class: 'size-8 text-sm',
  },
};

/**
 * Large avatar (48px).
 */
export const Large: Story = {
  args: {
    class: 'size-12 text-lg',
  },
};

/**
 * Extra large avatar (64px).
 */
export const ExtraLarge: Story = {
  args: {
    class: 'size-16 text-xl',
  },
};

/**
 * All avatar sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngAvatar, SngAvatarFallback],
    },
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="text-align: center;">
          <sng-avatar class="size-6 text-xs">
            <sng-avatar-fallback>XS</sng-avatar-fallback>
          </sng-avatar>
          <p style="font-size: 10px; color: gray; margin-top: 4px;">size-6</p>
        </div>
        <div style="text-align: center;">
          <sng-avatar class="size-8 text-sm">
            <sng-avatar-fallback>SM</sng-avatar-fallback>
          </sng-avatar>
          <p style="font-size: 10px; color: gray; margin-top: 4px;">size-8</p>
        </div>
        <div style="text-align: center;">
          <sng-avatar>
            <sng-avatar-fallback>MD</sng-avatar-fallback>
          </sng-avatar>
          <p style="font-size: 10px; color: gray; margin-top: 4px;">default</p>
        </div>
        <div style="text-align: center;">
          <sng-avatar class="size-12 text-lg">
            <sng-avatar-fallback>LG</sng-avatar-fallback>
          </sng-avatar>
          <p style="font-size: 10px; color: gray; margin-top: 4px;">size-12</p>
        </div>
        <div style="text-align: center;">
          <sng-avatar class="size-16 text-xl">
            <sng-avatar-fallback>XL</sng-avatar-fallback>
          </sng-avatar>
          <p style="font-size: 10px; color: gray; margin-top: 4px;">size-16</p>
        </div>
      </div>
    `,
  }),
};

/**
 * Avatar group with overlapping layout.
 */
export const AvatarGroup: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [SngAvatar, SngAvatarImage, SngAvatarFallback],
    },
    template: `
      <div style="display: flex;">
        <sng-avatar class="border-2 border-background">
          <sng-avatar-image src="https://avatars.githubusercontent.com/u/9919?v=4" alt="User 1" />
          <sng-avatar-fallback>CN</sng-avatar-fallback>
        </sng-avatar>
        <sng-avatar class="border-2 border-background -ml-3">
          <sng-avatar-fallback>AB</sng-avatar-fallback>
        </sng-avatar>
        <sng-avatar class="border-2 border-background -ml-3">
          <sng-avatar-fallback>CD</sng-avatar-fallback>
        </sng-avatar>
        <sng-avatar class="border-2 border-background -ml-3">
          <sng-avatar-fallback>+3</sng-avatar-fallback>
        </sng-avatar>
      </div>
    `,
  }),
};

/**
 * Avatar with icon fallback.
 */
export const WithIconFallback: Story = {
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [SngAvatar, SngAvatarFallback],
    },
    template: `
      <sng-avatar ${argsToTemplate(args)}>
        <sng-avatar-fallback>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </sng-avatar-fallback>
      </sng-avatar>
    `,
  }),
};

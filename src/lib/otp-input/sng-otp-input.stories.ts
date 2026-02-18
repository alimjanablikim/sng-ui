import { NgModule } from '@angular/core';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { SngOtpInput, REGEXP_ONLY_DIGITS_AND_CHARS } from './sng-otp-input';
import { SngOtpInputGroup } from './sng-otp-input-group';
import { SngOtpInputSlot } from './sng-otp-input-slot';
import { SngOtpInputSeparator } from './sng-otp-input-separator';

// NgModule wrapper to help Storybook JIT compilation with nested content projection
@NgModule({
  imports: [SngOtpInput, SngOtpInputGroup, SngOtpInputSlot, SngOtpInputSeparator],
  exports: [SngOtpInput, SngOtpInputGroup, SngOtpInputSlot, SngOtpInputSeparator],
})
class OtpInputModule {}

/**
 * OTP (One-Time Password) input component with individual character slots.
 *
 * Use slot sub-components to create the visual layout.
 */
const meta: Meta<SngOtpInput> = {
  title: 'UI/OTP Input',
  component: SngOtpInput,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [OtpInputModule],
    }),
  ],
  argTypes: {
    maxLength: {
      control: 'number',
      description: 'Number of OTP digits/characters',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '6' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<SngOtpInput>;

/**
 * Basic OTP input with 6 digits in a single group.
 */
export const Default: Story = {
  render: () => ({
    template: `
      <sng-otp-input [maxLength]="6">
        <sng-otp-input-group>
          <sng-otp-input-slot [index]="0" />
          <sng-otp-input-slot [index]="1" />
          <sng-otp-input-slot [index]="2" />
          <sng-otp-input-slot [index]="3" />
          <sng-otp-input-slot [index]="4" />
          <sng-otp-input-slot [index]="5" />
        </sng-otp-input-group>
      </sng-otp-input>
    `,
  }),
};

/**
 * OTP input with separator between groups (3-3 pattern).
 */
export const WithSeparator: Story = {
  render: () => ({
    template: `
      <sng-otp-input [maxLength]="6">
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
    `,
  }),
};

/**
 * OTP input that accepts alphanumeric characters.
 */
export const Alphanumeric: Story = {
  render: () => ({
    props: {
      pattern: REGEXP_ONLY_DIGITS_AND_CHARS,
    },
    template: `
      <sng-otp-input [maxLength]="6" [pattern]="pattern">
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
    `,
  }),
};

/**
 * Disabled OTP input.
 */
export const Disabled: Story = {
  render: () => ({
    template: `
      <sng-otp-input [maxLength]="6" disabled>
        <sng-otp-input-group>
          <sng-otp-input-slot [index]="0" />
          <sng-otp-input-slot [index]="1" />
          <sng-otp-input-slot [index]="2" />
          <sng-otp-input-slot [index]="3" />
          <sng-otp-input-slot [index]="4" />
          <sng-otp-input-slot [index]="5" />
        </sng-otp-input-group>
      </sng-otp-input>
    `,
  }),
};

/**
 * 4-digit OTP for PIN codes.
 */
export const FourDigitPin: Story = {
  render: () => ({
    template: `
      <sng-otp-input [maxLength]="4">
        <sng-otp-input-group>
          <sng-otp-input-slot [index]="0" />
          <sng-otp-input-slot [index]="1" />
          <sng-otp-input-slot [index]="2" />
          <sng-otp-input-slot [index]="3" />
        </sng-otp-input-group>
      </sng-otp-input>
    `,
  }),
};

import type { Meta, StoryObj } from '@storybook/angular';
import { SngDialog } from './sng-dialog';
import { SngDialogContent } from './sng-dialog-content';
import { SngDialogHeader } from './sng-dialog-header';
import { SngDialogTitle } from './sng-dialog-title';
import { SngDialogDescription } from './sng-dialog-description';
import { SngDialogFooter } from './sng-dialog-footer';
import { SngDialogClose } from './sng-dialog-close';
import { SngButton } from '../button/sng-button';
import { SngInput } from '../input/sng-input';

/**
 * Dialog is a modal window overlaid on the primary content.
 *
 * Built on Angular CDK Overlay with focus trapping.
 * Features animated open/close transitions using inline CSS @keyframes.
 */
const meta: Meta<SngDialog> = {
  title: 'UI/Dialog',
  component: SngDialog,
  tags: ['autodocs'],
  render: () => ({
    moduleMetadata: {
      imports: [
        SngDialog,
        SngDialogContent,
        SngDialogHeader,
        SngDialogTitle,
        SngDialogDescription,
        SngDialogFooter,
        SngDialogClose,
        SngButton,
      ],
    },
    template: `
      <sng-dialog #dialog>
        <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="dialog.open(content)">Open Dialog</sng-button>
        <ng-template #content>
          <sng-dialog-content>
            <sng-dialog-header>
              <sng-dialog-title>Are you absolutely sure?</sng-dialog-title>
              <sng-dialog-description>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </sng-dialog-description>
            </sng-dialog-header>
            <sng-dialog-footer>
              <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" sng-dialog-close>Cancel</sng-button>
              <sng-button class="bg-destructive text-white hover:bg-destructive/90">Continue</sng-button>
            </sng-dialog-footer>
          </sng-dialog-content>
        </ng-template>
      </sng-dialog>
    `,
  }),
};

export default meta;
type Story = StoryObj<SngDialog>;

/**
 * Default dialog with title, description, and action buttons.
 */
export const Default: Story = {};

/**
 * Dialog with a form for user input.
 */
export const WithForm: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngDialog,
        SngDialogContent,
        SngDialogHeader,
        SngDialogTitle,
        SngDialogDescription,
        SngDialogFooter,
        SngDialogClose,
        SngButton,
        SngInput,
      ],
    },
    template: `
      <sng-dialog #dialog>
        <sng-button (click)="dialog.open(content)">Edit Profile</sng-button>
        <ng-template #content>
          <sng-dialog-content>
            <sng-dialog-header>
              <sng-dialog-title>Edit profile</sng-dialog-title>
              <sng-dialog-description>
                Make changes to your profile here. Click save when you're done.
              </sng-dialog-description>
            </sng-dialog-header>
            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <label for="name" class="text-sm font-medium text-right">Name</label>
                <sng-input id="name" value="Pedro Duarte" class="col-span-3" />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <label for="username" class="text-sm font-medium text-right">Username</label>
                <sng-input id="username" value="@peduarte" class="col-span-3" />
              </div>
            </div>
            <sng-dialog-footer>
              <sng-button type="submit" sng-dialog-close>Save changes</sng-button>
            </sng-dialog-footer>
          </sng-dialog-content>
        </ng-template>
      </sng-dialog>
    `,
  }),
};

/**
 * Alert dialog mode - uses role="alertdialog", prevents backdrop close, restores focus.
 * Use [alert]="true" for important confirmations that require explicit action.
 */
export const AlertMode: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngDialog,
        SngDialogContent,
        SngDialogHeader,
        SngDialogTitle,
        SngDialogDescription,
        SngDialogFooter,
        SngDialogClose,
        SngButton,
      ],
    },
    template: `
      <sng-dialog #dialog [alert]="true">
        <sng-button class="bg-destructive text-white hover:bg-destructive/90" (click)="dialog.open(content)">Delete Account</sng-button>
        <ng-template #content>
          <sng-dialog-content>
            <sng-dialog-header>
              <sng-dialog-title>Are you absolutely sure?</sng-dialog-title>
              <sng-dialog-description>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </sng-dialog-description>
            </sng-dialog-header>
            <sng-dialog-footer>
              <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="dialog.close()">Cancel</sng-button>
              <sng-button class="bg-destructive text-white hover:bg-destructive/90" (click)="dialog.close()">Yes, delete account</sng-button>
            </sng-dialog-footer>
          </sng-dialog-content>
        </ng-template>
      </sng-dialog>
    `,
  }),
};

/**
 * Dialog with only a close button (minimal UI).
 */
export const Minimal: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngDialog,
        SngDialogContent,
        SngDialogHeader,
        SngDialogTitle,
        SngDialogClose,
        SngButton,
      ],
    },
    template: `
      <sng-dialog #dialog>
        <sng-button class="bg-secondary text-secondary-foreground hover:bg-secondary/80" (click)="dialog.open(content)">View Details</sng-button>
        <ng-template #content>
          <sng-dialog-content>
            <sng-dialog-header>
              <sng-dialog-title>Details</sng-dialog-title>
            </sng-dialog-header>
            <div class="py-4">
              <p class="text-sm text-muted-foreground">
                This is a minimal dialog with just a title and content.
                Click outside or use the close button to close.
              </p>
            </div>
          </sng-dialog-content>
        </ng-template>
      </sng-dialog>
    `,
  }),
};

/**
 * Dialog with custom width using class input.
 */
export const CustomWidth: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngDialog,
        SngDialogContent,
        SngDialogHeader,
        SngDialogTitle,
        SngDialogDescription,
        SngDialogFooter,
        SngDialogClose,
        SngButton,
      ],
    },
    template: `
      <sng-dialog #dialog>
        <sng-button (click)="dialog.open(content)">Wide Dialog</sng-button>
        <ng-template #content>
          <sng-dialog-content class="sm:max-w-2xl">
            <sng-dialog-header>
              <sng-dialog-title>Wide Dialog</sng-dialog-title>
              <sng-dialog-description>
                This dialog uses a custom width via the class input.
              </sng-dialog-description>
            </sng-dialog-header>
            <div class="py-4">
              <p class="text-sm text-muted-foreground">
                The content area is wider than the default, useful for displaying
                tables, images, or other wide content.
              </p>
            </div>
            <sng-dialog-footer>
              <sng-button sng-dialog-close>Close</sng-button>
            </sng-dialog-footer>
          </sng-dialog-content>
        </ng-template>
      </sng-dialog>
    `,
  }),
};

/**
 * Dialog with scrollable content.
 */
export const ScrollableContent: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [
        SngDialog,
        SngDialogContent,
        SngDialogHeader,
        SngDialogTitle,
        SngDialogDescription,
        SngDialogFooter,
        SngDialogClose,
        SngButton,
      ],
    },
    template: `
      <sng-dialog #dialog>
        <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" (click)="dialog.open(content)">Terms of Service</sng-button>
        <ng-template #content>
          <sng-dialog-content>
            <sng-dialog-header>
              <sng-dialog-title>Terms of Service</sng-dialog-title>
              <sng-dialog-description>Please read our terms carefully.</sng-dialog-description>
            </sng-dialog-header>
            <div class="max-h-[300px] overflow-y-auto py-4 text-sm text-muted-foreground">
              <p class="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              <p class="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              <p class="mb-4">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
              <p class="mb-4">Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
              <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
            </div>
            <sng-dialog-footer>
              <sng-button class="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" sng-dialog-close>Decline</sng-button>
              <sng-button sng-dialog-close>Accept</sng-button>
            </sng-dialog-footer>
          </sng-dialog-content>
        </ng-template>
      </sng-dialog>
    `,
  }),
};

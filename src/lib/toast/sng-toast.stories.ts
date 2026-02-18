import { type Meta, type StoryObj } from '@storybook/angular';
import { Component, inject } from '@angular/core';
import { SngToaster } from './sng-toaster';
import { SngToastService } from './sng-toast.service';

@Component({
  selector: 'toast-demo',
  standalone: true,
  imports: [SngToaster],
  template: `
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          (click)="showDefault()"
        >
          Default Toast
        </button>
        <button
          class="inline-flex h-9 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700"
          (click)="showSuccess()"
        >
          Success Toast
        </button>
        <button
          class="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
          (click)="showError()"
        >
          Error Toast
        </button>
        <button
          class="inline-flex h-9 items-center justify-center rounded-md bg-yellow-600 px-4 text-sm font-medium text-white hover:bg-yellow-700"
          (click)="showWarning()"
        >
          Warning Toast
        </button>
      </div>
      <sng-toaster />
    </div>
  `,
})
class ToastDemoComponent {
  private toastService = inject(SngToastService);

  showDefault(): void {
    this.toastService.show({
      title: 'Notification',
      description: 'This is a default toast notification.',
    });
  }

  showSuccess(): void {
    this.toastService.success('Success!', 'Your changes have been saved successfully.');
  }

  showError(): void {
    this.toastService.error('Error', 'Something went wrong. Please try again.');
  }

  showWarning(): void {
    this.toastService.warning('Warning', 'Please review the form before submitting.');
  }
}

@Component({
  selector: 'toast-action-demo',
  standalone: true,
  imports: [SngToaster],
  template: `
    <div class="space-y-4">
      <button
        class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        (click)="showWithAction()"
      >
        Toast with Action
      </button>
      <sng-toaster />
    </div>
  `,
})
class ToastActionDemoComponent {
  private toastService = inject(SngToastService);

  showWithAction(): void {
    this.toastService.show({
      title: 'File deleted',
      description: 'The file has been moved to trash.',
      action: {
        label: 'Undo',
        onClick: () => {
          this.toastService.success('Restored', 'File has been restored.');
        },
      },
    });
  }
}

@Component({
  selector: 'toast-position-demo',
  standalone: true,
  imports: [SngToaster],
  template: `
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          (click)="showAt('top-left')"
        >
          Top Left
        </button>
        <button
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          (click)="showAt('top-center')"
        >
          Top Center
        </button>
        <button
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          (click)="showAt('top-right')"
        >
          Top Right
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          (click)="showAt('bottom-left')"
        >
          Bottom Left
        </button>
        <button
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          (click)="showAt('bottom-center')"
        >
          Bottom Center
        </button>
        <button
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          (click)="showAt('bottom-right')"
        >
          Bottom Right
        </button>
      </div>
      <sng-toaster />
    </div>
  `,
})
class ToastPositionDemoComponent {
  private toastService = inject(SngToastService);

  showAt(position: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center'): void {
    this.toastService.show({
      title: `Toast at ${position}`,
      description: 'This toast appears at the specified position.',
      position,
    });
  }
}

@Component({
  selector: 'toast-fixed-demo',
  standalone: true,
  imports: [SngToaster],
  template: `
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          (click)="showFixed()"
        >
          Fixed Toast (Manual Dismiss)
        </button>
        <button
          class="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium hover:bg-accent"
          (click)="dismissAll()"
        >
          Dismiss All
        </button>
      </div>
      <sng-toaster />
    </div>
  `,
})
class ToastFixedDemoComponent {
  private toastService = inject(SngToastService);

  showFixed(): void {
    this.toastService.show({
      title: 'Persistent notification',
      description: 'This toast will stay until you dismiss it manually.',
      dismissType: 'fixed',
    });
  }

  dismissAll(): void {
    this.toastService.dismissAll();
  }
}

const meta: Meta = {
  title: 'UI/Toast',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * Default toast styles (default, success, error, warning).
 */
export const Default: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ToastDemoComponent],
    },
    template: `<toast-demo />`,
  }),
};

/**
 * Toast with an action button that triggers a callback.
 */
export const WithAction: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ToastActionDemoComponent],
    },
    template: `<toast-action-demo />`,
  }),
};

/**
 * Toast positioning options.
 */
export const Positions: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ToastPositionDemoComponent],
    },
    template: `<toast-position-demo />`,
  }),
};

/**
 * Fixed toast that requires manual dismissal.
 */
export const FixedDismiss: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [ToastFixedDemoComponent],
    },
    template: `<toast-fixed-demo />`,
  }),
};

import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  model,
  signal,
  computed,
  viewChild,
  ElementRef,
  booleanAttribute,
} from '@angular/core';
import { cn } from './cn';

/**
 * File input component with button and dropzone modes.
 *
 * @example
 * ```html
 * <sng-file-input [(files)]="selectedFiles" />
 * <sng-file-input dropzone multiple accept="image/*" />
 * ```
 */
@Component({
  selector: 'sng-file-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <input
      #fileInputRef
      type="file"
      class="sr-only"
      [accept]="accept()"
      [multiple]="multiple()"
      [disabled]="disabled()"
      (change)="onFileChange($event)"
    />

    @if (dropzone()) {
      <!-- Dropzone mode -->
      <div
        [class]="dropzoneClasses()"
        tabindex="0"
        role="button"
        [attr.aria-label]="'Upload files' + (accept() ? ', accepts: ' + accept() : '')"
        (click)="openFilePicker()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <svg
          class="h-10 w-10 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <div class="text-center">
          <p class="text-sm font-medium text-foreground">
            Drag & drop files here
          </p>
          <p class="text-xs text-muted-foreground">
            or click to browse
          </p>
        </div>
        @if (accept()) {
          <p class="text-xs text-muted-foreground">
            Accepted: {{ accept() }}
          </p>
        }
      </div>
    } @else {
      <!-- Button mode -->
      <div [class]="buttonModeClasses()">
        <button
          type="button"
          class="h-full rounded-l-md border-r border-border bg-muted px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
          [disabled]="disabled()"
          (click)="openFilePicker()"
        >
          Choose File
        </button>
        <span class="flex-1 truncate px-3 text-muted-foreground">
          {{ fileNameDisplay() }}
        </span>
      </div>
    }

    <!-- Selected files list -->
    @if (files().length > 0 && showFileList()) {
      <div class="mt-2 space-y-1">
        @for (file of files(); track file.name) {
          <div
            class="flex items-center justify-between rounded-md border border-border bg-muted/50 px-3 py-1.5 text-sm"
          >
            <span class="truncate text-foreground">{{ file.name }}</span>
            <button
              type="button"
              class="ml-2 text-muted-foreground transition-colors hover:text-foreground"
              [disabled]="disabled()"
              (click)="removeFile(file)"
            >
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        }
      </div>
    }
  `,
})
export class SngFileInput {
  private fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInputRef');

  /** Whether the input is disabled. */
  disabled = input(false, { transform: booleanAttribute });

  /** Whether to show dropzone mode. */
  dropzone = input(false, { transform: booleanAttribute });

  /** Whether multiple files can be selected. */
  multiple = input(false, { transform: booleanAttribute });

  /** Accepted file types (e.g., '.jpg,.png' or 'image/*'). */
  accept = input<string>('');

  /** Whether to show the file list below the input. */
  showFileList = input(true, { transform: booleanAttribute });

  /** Custom CSS classes. */
  class = input<string>('');

  /** Selected files. Supports two-way binding via [(files)]. */
  files = model<File[]>([]);

  /** @internal */
  _isDragging = signal(false);

  /** @internal */
  hostClasses = computed(() => cn('block w-full', this.class()));

  /** @internal */
  dropzoneClasses = computed(() =>
    cn(
      'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors',
      this._isDragging() ? 'border-primary bg-muted/50' : 'border-muted-foreground/25',
      this.disabled() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    )
  );

  /** @internal */
  buttonModeClasses = computed(() =>
    cn(
      'flex h-9 items-center rounded-md border border-border bg-background text-sm shadow-sm transition-colors',
      this.disabled() ? 'cursor-not-allowed opacity-50' : ''
    )
  );

  /** @internal */
  fileNameDisplay = computed(() => {
    const fileList = this.files();
    if (fileList.length === 0) return 'No file chosen';
    if (fileList.length === 1) return fileList[0].name;
    return `${fileList.length} files selected`;
  });

  /** Open the native file picker dialog. */
  openFilePicker(): void {
    if (this.disabled()) return;
    this.fileInputRef()?.nativeElement.click();
  }

  /** @internal */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files);
      this.files.set(newFiles);
    }
  }

  /** @internal */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled()) {
      this._isDragging.set(true);
    }
  }

  /** @internal */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this._isDragging.set(false);
  }

  /** @internal */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this._isDragging.set(false);

    if (this.disabled()) return;

    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      let newFiles = Array.from(droppedFiles);

      // Filter by accept if specified
      const acceptAttr = this.accept();
      if (acceptAttr) {
        newFiles = this.filterFilesByAccept(newFiles, acceptAttr);
      }

      // Handle multiple vs single
      if (!this.multiple() && newFiles.length > 1) {
        newFiles = [newFiles[0]];
      }

      this.files.set(newFiles);
    }
  }

  /** Remove a specific file from the selection. */
  removeFile(fileToRemove: File): void {
    if (this.disabled()) return;
    const updatedFiles = this.files().filter(f => f !== fileToRemove);
    this.files.set(updatedFiles);

    // Clear the native input
    const inputEl = this.fileInputRef()?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  /** Clear all selected files. */
  clearFiles(): void {
    this.files.set([]);
    const inputEl = this.fileInputRef()?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }

  private filterFilesByAccept(files: File[], accept: string): File[] {
    const acceptTypes = accept.split(',').map(t => t.trim().toLowerCase());
    return files.filter(file => {
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      return acceptTypes.some(acceptType => {
        if (acceptType.startsWith('.')) {
          // Extension match (e.g., .jpg, .png)
          return fileName.endsWith(acceptType);
        } else if (acceptType.endsWith('/*')) {
          // MIME type wildcard (e.g., image/*)
          const category = acceptType.slice(0, -2);
          return fileType.startsWith(category);
        } else {
          // Exact MIME type match
          return fileType === acceptType;
        }
      });
    });
  }
}

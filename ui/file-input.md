# ShadNG File Input

Angular file input with button and drag-and-drop modes. Supports multiple files, type filtering, and visual file list with remove buttons.

## Installation

```bash
npx @shadng/sng-ui add file-input
```

## Basic Usage

```html
<!-- Button mode (default) -->
<sng-file-input [(files)]="selectedFiles" />

<!-- Dropzone mode -->
<sng-file-input dropzone [(files)]="selectedFiles" />

<!-- Multiple files with type filter -->
<sng-file-input dropzone multiple accept="image/*" />

<!-- Without file list display -->
<sng-file-input [showFileList]="false" (filesChange)="onFiles($event)" />
```

---

# SngFileInput Technical Reference

Complete reference for implementing the file input component. Provides button and dropzone modes with file type filtering.

## Component Architecture

```typescript
// 1 component (standalone):
// SngFileInput - File input with two display modes
```

## Implementation

```typescript
// projects/sng-ui/src/lib/file-input/sng-file-input.ts
import { Component, input, model, output, signal, computed } from '@angular/core';
import { cn } from './cn';

@Component({
  selector: 'sng-file-input',
  standalone: true,
  template: `
    <input
      type="file"
      class="sr-only"
      [accept]="accept()"
      [multiple]="multiple()"
      [disabled]="disabled()"
      (change)="onFileChange($event)"
    />

    @if (dropzone()) {
      <div
        [class]="dropzoneClasses()"
        (click)="openFilePicker()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <svg class="h-10 w-10 text-muted-foreground"><!-- upload icon --></svg>
        <p>Drag & drop files here or click to browse</p>
      </div>
    } @else {
      <div class="flex items-center rounded-md border">
        <button type="button" (click)="openFilePicker()">Choose File</button>
        <span>{{ fileNameDisplay() }}</span>
      </div>
    }

    @if (files().length > 0 && showFileList()) {
      <div class="mt-2 space-y-1">
        @for (file of files(); track file.name) {
          <div class="flex items-center justify-between">
            <span>{{ file.name }}</span>
            <button (click)="removeFile(file)">x</button>
          </div>
        }
      </div>
    }
  `,
})
export class SngFileInput {
  disabled = input(false);
  dropzone = input(false);
  multiple = input(false);
  accept = input<string>('');
  showFileList = input(true);
  class = input<string>('');

  files = model<File[]>([]);
  filesChange = output<File[]>();

  isDragging = signal(false);

  fileNameDisplay = computed(() => {
    const fileList = this.files();
    if (fileList.length === 0) return 'No file chosen';
    if (fileList.length === 1) return fileList[0].name;
    return `${fileList.length} files selected`;
  });
}
```

## Accept Patterns

```html
<!-- Any image -->
<sng-file-input accept="image/*" />

<!-- Specific image types -->
<sng-file-input accept="image/png,image/jpeg" />

<!-- By extension -->
<sng-file-input accept=".pdf,.doc,.docx" />

<!-- Multiple categories -->
<sng-file-input accept="image/*,.pdf" />
```

## Handling File Selection

```typescript
@Component({
  template: `
    <sng-file-input
      dropzone
      multiple
      accept="image/*"
      (filesChange)="onFilesSelected($event)"
    />
  `
})
export class UploadComponent {
  onFilesSelected(files: File[]) {
    // Validate file sizes
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(f => f.size <= maxSize);

    if (validFiles.length < files.length) {
      this.toast.error('Some files were too large');
    }

    // Upload valid files
    validFiles.forEach(file => this.uploadService.upload(file));
  }
}
```

## Do's and Don'ts

### Do
- Use dropzone mode for bulk uploads
- Filter file types with accept attribute
- Validate file sizes before uploading
- Show upload progress for large files
- Let users remove individual files

### Don't
- Force users to re-select all files to remove one
- Accept all file types when you only need specific ones
- Upload without validating size/type on the client
- Forget to handle upload errors gracefully

## Accessibility

- Hidden native file input for screen readers
- Click opens the file picker
- Dropzone has proper focus states
- Clear visual feedback for drag operations

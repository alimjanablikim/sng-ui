import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngFileInput } from './sng-file-input';

@Component({
  standalone: true,
  imports: [SngFileInput],
  template: `
    <sng-file-input
      [(files)]="files"
      [disabled]="disabled"
      [dropzone]="dropzone"
      [multiple]="multiple"
      [accept]="accept"
      [showFileList]="showFileList"
      [class]="customClass"
    />
  `,
})
class TestHostComponent {
  files: File[] = [];
  disabled = false;
  dropzone = false;
  multiple = false;
  accept = '';
  showFileList = true;
  customClass = '';
}

describe('SngFileInput', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let fileInput: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    fileInput = fixture.nativeElement.querySelector('sng-file-input');
    expect(fileInput).toBeTruthy();
  });

  it('should render button mode by default', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent.trim()).toBe('Choose File');
  });

  it('should render dropzone mode when enabled', () => {
    host.dropzone = true;
    fixture.detectChanges();
    const dropzone = fixture.nativeElement.querySelector('[role="button"]');
    expect(dropzone).toBeTruthy();
    expect(dropzone.textContent).toContain('Drag & drop');
  });

  it('should have hidden file input', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
    expect(input.classList.contains('sr-only')).toBeTrue();
  });

  it('should accept multiple files when multiple is true', () => {
    host.multiple = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    expect(input.multiple).toBeTrue();
  });

  it('should apply accept attribute', () => {
    host.accept = 'image/*';
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    expect(input.accept).toBe('image/*');
  });

  it('should disable input when disabled is true', () => {
    host.disabled = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    expect(input.disabled).toBeTrue();
  });

  it('should show file list when files are selected', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    host.files = [mockFile];
    fixture.detectChanges();

    const fileList = fixture.nativeElement.querySelector('.mt-2');
    expect(fileList).toBeTruthy();
    expect(fileList.textContent).toContain('test.txt');
  });

  it('should hide file list when showFileList is false', () => {
    const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    host.files = [mockFile];
    host.showFileList = false;
    fixture.detectChanges();

    const fileList = fixture.nativeElement.querySelector('.mt-2');
    expect(fileList).toBeFalsy();
  });

  it('should display correct text for no files', () => {
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span.flex-1');
    expect(span.textContent.trim()).toBe('No file chosen');
  });

  it('should display file name for single file', () => {
    const mockFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    host.files = [mockFile];
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span.flex-1');
    expect(span.textContent.trim()).toBe('document.pdf');
  });

  it('should display count for multiple files', () => {
    const mockFiles = [
      new File(['content'], 'file1.txt', { type: 'text/plain' }),
      new File(['content'], 'file2.txt', { type: 'text/plain' }),
      new File(['content'], 'file3.txt', { type: 'text/plain' }),
    ];
    host.files = mockFiles;
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span.flex-1');
    expect(span.textContent.trim()).toBe('3 files selected');
  });

  it('should apply custom class', () => {
    host.customClass = 'max-w-md';
    fixture.detectChanges();
    fileInput = fixture.nativeElement.querySelector('sng-file-input');
    expect(fileInput.classList.contains('max-w-md')).toBeTrue();
  });

  it('should show accepted types in dropzone mode', () => {
    host.dropzone = true;
    host.accept = '.pdf,.doc';
    fixture.detectChanges();

    const dropzone = fixture.nativeElement.querySelector('[role="button"]');
    expect(dropzone.textContent).toContain('.pdf,.doc');
  });
});

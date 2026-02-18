import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { SngPreviewBoxComponent } from './sng-preview-box';
import { SngPreviewBlock } from './sng-preview-block';
import { SngPreviewCodeBlock } from './sng-code-block';

@Component({
  standalone: true,
  imports: [SngPreviewBoxComponent, SngPreviewBlock],
  template: `
    <sng-preview-box [class]="boxClass">
      <sng-preview-block>
        <div class="preview-content">Preview content here</div>
      </sng-preview-block>
    </sng-preview-box>
  `,
})
class TestHostComponent {
  boxClass = '';
}

@Component({
  standalone: true,
  imports: [SngPreviewBoxComponent, SngPreviewBlock, SngPreviewCodeBlock],
  template: `
    <sng-preview-box>
      <sng-preview-block>
        <div>Preview content</div>
      </sng-preview-block>
      <sng-preview-code-block [code]="code" />
    </sng-preview-box>
  `,
})
class PreviewCodeBlockHostComponent {
  code = 'const demo = true;';
}

describe('SngPreviewBox', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let previewBox: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  describe('Basic functionality', () => {
    it('should create', () => {
      fixture.detectChanges();
      previewBox = fixture.nativeElement.querySelector('sng-preview-box');
      expect(previewBox).toBeTruthy();
    });

    it('should render preview block', () => {
      fixture.detectChanges();
      const previewBlock = fixture.nativeElement.querySelector('sng-preview-block');
      expect(previewBlock).toBeTruthy();
    });

    it('should render content', () => {
      fixture.detectChanges();
      const content = fixture.nativeElement.querySelector('.preview-content');
      expect(content).toBeTruthy();
      expect(content.textContent).toContain('Preview content here');
    });
  });

  describe('SngPreviewBlock', () => {
    it('should exist', () => {
      fixture.detectChanges();
      const block = fixture.nativeElement.querySelector('sng-preview-block');
      expect(block).toBeTruthy();
    });
  });

  describe('Class input', () => {
    it('should apply custom classes', () => {
      host.boxClass = 'max-w-2xl';
      fixture.detectChanges();
      // The class input is applied to the host element
      previewBox = fixture.nativeElement.querySelector('sng-preview-box');

      expect(previewBox.classList.contains('max-w-2xl')).toBeTrue();
    });
  });

  describe('SngPreviewCodeBlock compatibility', () => {
    it('should render Code tab when using sng-preview-code-block', () => {
      const previewCodeFixture = TestBed.createComponent(PreviewCodeBlockHostComponent);
      previewCodeFixture.detectChanges();

      const buttons = Array.from(
        previewCodeFixture.nativeElement.querySelectorAll('button')
      ) as HTMLButtonElement[];
      const codeTabButton = buttons.find(button => button.textContent?.trim() === 'Code');

      expect(codeTabButton).toBeTruthy();
    });
  });
});

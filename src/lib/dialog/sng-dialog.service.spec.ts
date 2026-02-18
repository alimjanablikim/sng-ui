import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { SngDialogService, SngDialogRef } from './sng-dialog.service';

@Component({
  standalone: true,
  template: `<div>Test Dialog Content</div>`,
})
class TestDialogComponent {}

function createOverlayRefMock() {
  const backdrop$ = new Subject<MouseEvent>();
  const overlayRef = {
    attach: jasmine.createSpy('attach').and.returnValue({ instance: {} }),
    backdropClick: jasmine.createSpy('backdropClick').and.returnValue(backdrop$.asObservable()),
    dispose: jasmine.createSpy('dispose'),
    overlayElement: {
      querySelectorAll: () => [],
      getAnimations: () => [],
    },
  };
  return { overlayRef, backdrop$ };
}

describe('SngDialogService', () => {
  let service: SngDialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayModule, TestDialogComponent],
      providers: [provideZonelessChangeDetection(), SngDialogService],
    }).compileComponents();

    service = TestBed.inject(SngDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a dialog', () => {
    const dialogRef = service.open(TestDialogComponent);
    expect(dialogRef).toBeTruthy();
    expect(dialogRef instanceof SngDialogRef).toBeTrue();
    dialogRef.close();
  });

  it('should close dialog with result', (done) => {
    const dialogRef = service.open<TestDialogComponent, unknown, string>(
      TestDialogComponent
    );
    dialogRef.afterClosed$.subscribe((result) => {
      expect(result).toBe('test-result');
      done();
    });
    dialogRef.close('test-result');
  });

  it('should pass data to dialog', () => {
    const testData = { message: 'Hello' };
    const dialogRef = service.open(TestDialogComponent, { data: testData });
    expect(dialogRef).toBeTruthy();
    dialogRef.close();
  });

  it('should apply width config', () => {
    const dialogRef = service.open(TestDialogComponent, { width: '500px' });
    expect(dialogRef).toBeTruthy();
    dialogRef.close();
  });

  it('should configure block scroll strategy and panel classes', () => {
    const overlay = TestBed.inject(Overlay);
    const blockSpy = spyOn(overlay.scrollStrategies, 'block').and.callThrough();
    const createSpy = spyOn(overlay, 'create').and.callThrough();

    const dialogRef = service.open(TestDialogComponent, {
      width: '520px',
      panelClass: ['custom-a', 'custom-b'],
    });

    expect(blockSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();

    const config = createSpy.calls.mostRecent().args[0] as {
      hasBackdrop: boolean;
      panelClass: string | string[];
      width?: string;
    };
    const classes = Array.isArray(config.panelClass) ? config.panelClass : [config.panelClass];
    expect(config.hasBackdrop).toBeFalse();
    expect(config.width).toBe('520px');
    expect(classes).toContain('sng-dialog-panel');
    expect(classes).toContain('custom-a');
    expect(classes).toContain('custom-b');

    dialogRef.close();
  });

  it('should ignore backdrop when disableClose is true', () => {
    const overlay = TestBed.inject(Overlay);
    const { overlayRef, backdrop$ } = createOverlayRefMock();
    spyOn(overlay, 'create').and.returnValue(overlayRef as any);

    const dialogRef = service.open(TestDialogComponent, { disableClose: true });

    backdrop$.next(new MouseEvent('click'));

    expect(overlayRef.dispose).not.toHaveBeenCalled();

    dialogRef.close();
    expect(overlayRef.dispose).toHaveBeenCalledTimes(1);
  });

  it('should close on backdrop click when disableClose is false', () => {
    const overlay = TestBed.inject(Overlay);
    const { overlayRef, backdrop$ } = createOverlayRefMock();
    spyOn(overlay, 'create').and.returnValue(overlayRef as any);

    service.open(TestDialogComponent);
    backdrop$.next(new MouseEvent('click'));

    expect(overlayRef.dispose).toHaveBeenCalledTimes(1);
  });

  it('should close all dialogs', () => {
    const ref1 = service.open(TestDialogComponent);
    const ref2 = service.open(TestDialogComponent);

    let closedCount = 0;
    ref1.afterClosed$.subscribe(() => closedCount++);
    ref2.afterClosed$.subscribe(() => closedCount++);

    service.closeAll();
    expect(closedCount).toBe(2);
  });
});

describe('SngDialogRef', () => {
  function createDialogRefOverlayMock() {
    return {
      dispose: jasmine.createSpy('dispose'),
      overlayElement: {
        querySelectorAll: () => [],
        getAnimations: () => [],
      },
    } as any;
  }

  it('should store result after close', () => {
    const mockOverlayRef = createDialogRefOverlayMock();
    const dialogRef = new SngDialogRef(mockOverlayRef, {});

    dialogRef.close('my-result');

    expect(dialogRef.result).toBe('my-result');
    expect(mockOverlayRef.dispose).toHaveBeenCalled();
  });

  it('should emit undefined when closed without result', (done) => {
    const mockOverlayRef = createDialogRefOverlayMock();
    const dialogRef = new SngDialogRef(mockOverlayRef, {});

    dialogRef.afterClosed$.subscribe((result) => {
      expect(result).toBeUndefined();
      done();
    });

    dialogRef.close();
  });
});

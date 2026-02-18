import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { SngToastService } from './sng-toast.service';

describe('SngToastService', () => {
  let service: SngToastService;

  beforeEach(() => {
    // Clear global toasts before each test
    (window as any).__sngToasts = undefined;

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), SngToastService],
    });

    service = TestBed.inject(SngToastService);
  });

  afterEach(() => {
    service.dismissAll();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show a toast', () => {
    const id = service.show({ title: 'Test Toast' });
    expect(id).toBeTruthy();
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0].title).toBe('Test Toast');
  });

  it('should show toast with description', () => {
    service.show({ title: 'Title', description: 'Description' });
    expect(service.toasts()[0].description).toBe('Description');
  });

  it('should show success toast with green styling', () => {
    service.success('Success!', 'It worked');
    expect(service.toasts()[0].class).toContain('border-green-500');
    expect(service.toasts()[0].priority).toBe('polite');
    expect(service.toasts()[0].title).toBe('Success!');
    expect(service.toasts()[0].description).toBe('It worked');
  });

  it('should show error toast with red styling and assertive priority', () => {
    service.error('Error!', 'Something failed');
    expect(service.toasts()[0].class).toContain('border-red-500');
    expect(service.toasts()[0].priority).toBe('assertive');
  });

  it('should show warning toast with yellow styling', () => {
    service.warning('Warning!');
    expect(service.toasts()[0].class).toContain('border-yellow-500');
    expect(service.toasts()[0].priority).toBe('polite');
  });

  it('should mark toast closed then remove it after exit delay', () => {
    jasmine.clock().install();
    try {
      const id = service.show({ title: 'Test' });
      expect(service.toasts().length).toBe(1);

      service.dismiss(id);

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0]._state).toBe('closed');

      jasmine.clock().tick(350);
      expect(service.toasts().length).toBe(0);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('should dismiss all toasts', () => {
    service.show({ title: 'Toast 1' });
    service.show({ title: 'Toast 2' });
    expect(service.toasts().length).toBe(2);

    service.dismissAll();
    expect(service.toasts().length).toBe(0);
  });

  it('should limit to max 5 toasts', () => {
    for (let i = 0; i < 7; i++) {
      service.show({ title: `Toast ${i}` });
    }
    expect(service.toasts().length).toBe(5);
  });

  it('should use default values', () => {
    service.show({ title: 'Test' });
    const toast = service.toasts()[0];
    expect(toast.priority).toBe('polite');
    expect(toast.position).toBe('bottom-right');
    expect(toast.dismissType).toBe('countdown');
    expect(toast.duration).toBe(3000);
  });
});

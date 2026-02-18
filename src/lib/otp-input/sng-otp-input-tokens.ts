import { InjectionToken, Signal } from '@angular/core';

/** State for an individual OTP slot. */
export interface OtpSlotState {
  char: string;
  isActive: boolean;
  hasFakeCaret: boolean;
}

/** OTP context interface for child slots to inject. */
export interface SngOtpInputContext {
  slots: Signal<OtpSlotState[]>;
  focus: (index: number) => void;
}

/** Injection token for OTP context. */
export const SNG_OTP_INPUT_CONTEXT = new InjectionToken<SngOtpInputContext>('SNG_OTP_INPUT_CONTEXT');

/** @internal Key for storing OTP context on DOM element (fallback for content projection) */
export const OTP_CONTEXT_KEY = '__sngOtpInputContext__';

export * from './sng-dialog';
export * from './sng-dialog-content';
export * from './sng-dialog-header';
export * from './sng-dialog-title';
export * from './sng-dialog-description';
export * from './sng-dialog-footer';
export * from './sng-dialog-close';
export * from './sng-dialog.service';

// =============================================================================
// Alert Dialog Backwards Compatibility Aliases (deprecated)
// =============================================================================
// Note: These are TypeScript-level aliases only. Template selectors have changed:
// - Old: <sng-alert-dialog>, <sng-alert-dialog-content>, etc.
// - New: <sng-dialog [alert]="true">, <sng-dialog-content>, etc.
// Action/Cancel buttons: Use <sng-button sng-dialog-close> or call dialog.close()

/** @deprecated Use SngDialog with [alert]="true" instead */
export { SngDialog as SngAlertDialog } from './sng-dialog';
/** @deprecated Use SngDialogContent instead */
export { SngDialogContent as SngAlertDialogContent } from './sng-dialog-content';
/** @deprecated Use SngDialogHeader instead */
export { SngDialogHeader as SngAlertDialogHeader } from './sng-dialog-header';
/** @deprecated Use SngDialogTitle instead */
export { SngDialogTitle as SngAlertDialogTitle } from './sng-dialog-title';
/** @deprecated Use SngDialogDescription instead */
export { SngDialogDescription as SngAlertDialogDescription } from './sng-dialog-description';
/** @deprecated Use SngDialogFooter instead */
export { SngDialogFooter as SngAlertDialogFooter } from './sng-dialog-footer';
/** @deprecated Use SngDialogClose or sng-button with sng-dialog-close directive instead */
export { SngDialogClose as SngAlertDialogCancel } from './sng-dialog-close';
/** @deprecated Use SngDialogClose or sng-button with sng-dialog-close directive instead */
export { SngDialogClose as SngAlertDialogAction } from './sng-dialog-close';
/** @deprecated Use SNG_DIALOG_CLOSE instead */
export { SNG_DIALOG_CLOSE as SNG_ALERT_DIALOG_CLOSE } from './sng-dialog';
/** @deprecated Use SNG_DIALOG_STATE instead */
export { SNG_DIALOG_STATE as SNG_ALERT_DIALOG_STATE } from './sng-dialog';

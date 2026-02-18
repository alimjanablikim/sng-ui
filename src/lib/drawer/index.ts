export * from './sng-drawer';
export * from './sng-drawer-trigger';
export * from './sng-drawer-content';
export * from './sng-drawer-header';
export * from './sng-drawer-footer';
export * from './sng-drawer-title';
export * from './sng-drawer-description';
export * from './sng-drawer-close';
export * from './sng-drawer-handle';
export * from './sng-drawer-wrapper';

// =============================================================================
// Sheet Backwards Compatibility Aliases (deprecated)
// =============================================================================
// Note: These are TypeScript-level aliases only. Template selectors have changed:
// - Old: <sng-sheet>, <sng-sheet-content>, etc.
// - New: <sng-drawer [modal]="true">, <sng-drawer-content>, etc.

/** @deprecated Use SngDrawer with [modal]="true" instead */
export { SngDrawer as SngSheet } from './sng-drawer';
/** @deprecated Use SngDrawerTrigger instead */
export { SngDrawerTrigger as SngSheetTrigger } from './sng-drawer-trigger';
/** @deprecated Use SngDrawerContent instead */
export { SngDrawerContent as SngSheetContent } from './sng-drawer-content';
/** @deprecated Use SngDrawerHeader instead */
export { SngDrawerHeader as SngSheetHeader } from './sng-drawer-header';
/** @deprecated Use SngDrawerTitle instead */
export { SngDrawerTitle as SngSheetTitle } from './sng-drawer-title';
/** @deprecated Use SngDrawerDescription instead */
export { SngDrawerDescription as SngSheetDescription } from './sng-drawer-description';
/** @deprecated Use SngDrawerFooter instead */
export { SngDrawerFooter as SngSheetFooter } from './sng-drawer-footer';
/** @deprecated Use SngDrawerClose instead */
export { SngDrawerClose as SngSheetClose } from './sng-drawer-close';
/** @deprecated Use SngDrawerHandle instead */
export { SngDrawerHandle as SngSheetHandle } from './sng-drawer-handle';

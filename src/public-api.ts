/*
 * Public API Surface of sng-ui
 */

// Button
export { SngButton } from './lib/button';
export type { SngButtonType } from './lib/button';

// Code Block (Shiki syntax highlighting)
export { SngCodeBlock, type ShikiTheme } from './lib/code-block/sng-code-block';

// Preview Box
export {
  SngPreviewBoxComponent,
  SngPreviewBlock,
  SngHtmlBlock,
  SngPreviewCodeBlock,
  SngStyleBlock,
} from './lib/preview-box';

// Accordion
export {
  SngAccordion,
  SngAccordionItem,
  SngAccordionTrigger,
  SngAccordionContent,
} from './lib/accordion';

// Alert
export {
  SngAlert,
  SngAlertTitle,
  SngAlertDescription,
} from './lib/alert';

// Alert Dialog aliases (deprecated - use Dialog with [alert]="true" instead)
export {
  SngAlertDialog,
  SngAlertDialogContent,
  SngAlertDialogHeader,
  SngAlertDialogTitle,
  SngAlertDialogDescription,
  SngAlertDialogFooter,
  SngAlertDialogAction,
  SngAlertDialogCancel,
  SNG_ALERT_DIALOG_CLOSE,
  SNG_ALERT_DIALOG_STATE,
} from './lib/dialog';

// Input
export { SngInput, type SngInputType } from './lib/input';

// File Input (standalone component)
export { SngFileInput } from './lib/file-input';

// OTP Input
export {
  SngOtpInput,
  SngOtpInputGroup,
  SngOtpInputSlot,
  SngOtpInputSeparator,
  SNG_OTP_INPUT_CONTEXT,
  type SngOtpInputContext,
} from './lib/otp-input';

// Search Input (standalone component)
export {
  SngSearchInput,
  SngSearchInputList,
  SngSearchInputGroup,
  SngSearchInputItem,
  SngSearchInputEmpty,
  SngSearchInputSeparator,
  SngSearchInputShortcut,
  SNG_SEARCH_INPUT_CONTEXT,
  type SngSearchInputContext,
} from './lib/search-input';

// Badge
export { SngBadge } from './lib/badge';

// Separator
export { SngSeparator } from './lib/separator';

// Skeleton
export { SngSkeleton } from './lib/skeleton';

// Progress
export { SngProgress } from './lib/progress';

// Avatar
export {
  SngAvatar,
  SngAvatarImage,
  SngAvatarFallback,
} from './lib/avatar';

// Toggle (includes Toggle Group)
export { SngToggle, SngToggleGroup, SngToggleGroupItem, SNG_TOGGLE_GROUP } from './lib/toggle';

// Switch
export { SngSwitch } from './lib/switch';

// Checkbox
export { SngCheckbox } from './lib/checkbox';

// Radio
export * from './lib/radio';

// Tooltip
export * from './lib/tooltip';

// Slider
export * from './lib/slider';

// Card
export * from './lib/card';

// Select
export * from './lib/select/sng-select';
export * from './lib/select/sng-select-item';
export * from './lib/select/sng-select-content';
export * from './lib/select/sng-select-group';
export * from './lib/select/sng-select-label';
export * from './lib/select/sng-select-separator';
export * from './lib/select/sng-select-empty';

// Dialog
export * from './lib/dialog/sng-dialog';
export * from './lib/dialog/sng-dialog.service';
export * from './lib/dialog/sng-dialog-content';
export * from './lib/dialog/sng-dialog-header';
export * from './lib/dialog/sng-dialog-title';
export * from './lib/dialog/sng-dialog-description';
export * from './lib/dialog/sng-dialog-footer';
export * from './lib/dialog/sng-dialog-close';

// Tabs
export * from './lib/tabs/sng-tabs';
export * from './lib/tabs/sng-tabs-list';
export * from './lib/tabs/sng-tabs-trigger';
export * from './lib/tabs/sng-tabs-content';

// Toggle Group (old module path - kept for backwards compatibility)
// Components moved to toggle module but still accessible via old import path

// Breadcrumb
export * from './lib/breadcrumb/sng-breadcrumb';
export * from './lib/breadcrumb/sng-breadcrumb-list';
export * from './lib/breadcrumb/sng-breadcrumb-item';
export * from './lib/breadcrumb/sng-breadcrumb-link';
export * from './lib/breadcrumb/sng-breadcrumb-page';
export * from './lib/breadcrumb/sng-breadcrumb-separator';
export * from './lib/breadcrumb/sng-breadcrumb-ellipsis';

// Popover
export * from './lib/popover/sng-popover';
export * from './lib/popover/sng-popover-trigger';
export * from './lib/popover/sng-popover-content';

// Sheet aliases (deprecated - use Drawer with [modal]="true" instead)
export {
  SngSheet,
  SngSheetTrigger,
  SngSheetContent,
  SngSheetHeader,
  SngSheetTitle,
  SngSheetDescription,
  SngSheetFooter,
  SngSheetClose,
  SngSheetHandle,
} from './lib/drawer';

// Layout (Header, Footer, Sidebar)
export * from './lib/layout';

// Toast
export * from './lib/toast/sng-toast.service';
export * from './lib/toast/sng-toast';
export * from './lib/toast/sng-toaster';

// Navigation Menu
export * from './lib/nav-menu';

// Calendar
export * from './lib/calendar';

// Table Core (Headless)
export * from './lib/sng-table-core';

// Table UI Components
export * from './lib/sng-table';

// Carousel
export * from './lib/carousel';

// Drawer
export * from './lib/drawer';

// Hover Card
export * from './lib/hover-card';

// Resizable
export * from './lib/resizable';

// Menu (unified dropdown, context, menubar)
export * from './lib/menu';

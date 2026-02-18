# Sng Dashboard AI Context

This file is a practical build/edit specification for the ShadNG dashboard demo.
Use it when you want to:

- understand the current dashboard architecture
- modify existing pages safely
- build a similar dashboard with `@shadng/sng-ui` and `@shadng/sng-icons`

## Goal

Sng Dashboard models a tech-company operations workspace:

- one shared app shell
- many focused pages with realistic interactions
- local page state (signals) instead of a global store
- runtime i18n (EN, NL) and LTR/RTL support

## Package Baseline

Use these packages for new projects:

```bash
npm i @shadng/sng-ui @shadng/sng-icons
```

Copy-paste model (optional, per component):

```bash
npx @shadng/sng-ui add button card table dialog drawer
```

## Primary Entry Points

- routes: `src/app/pages/demo/demo.routes.ts`
- shell/layout: `src/app/pages/demo/layout/demo-layout.ts`
- i18n runtime map: `src/app/pages/demo/i18n/demo-i18n.runtime-text-map.ts`
- AI header actions: `src/app/shared/ai-assist/ai-assist-actions.ts`
- AI context URL at runtime: `https://shadng.js.org/ai/sng-dashboard.md`

## Shell Contract (What Must Stay Consistent)

`demo-layout.ts` owns the global app behavior:

- grouped sidebar navigation and collapse states
- top header navigation (`Home`, `Documentation`, `Icons`)
- theme switching (light, dark, catppuccin latte, catppuccin mocha)
- language switching (EN, NL)
- direction switching (LTR/RTL)
- AI actions (`AI Context`, `Ask AI`)

When editing pages, keep this shell as the stable frame.

## Route Blueprint

All in-shell routes are under `/demo/*`.

### Core Operations

| Route | Main Purpose | Primary Components |
|---|---|---|
| `/demo/dashboard` | high-level operations overview | `tabs`, `card`, `badge`, `progress` |
| `/demo/notifications` | alert stream and triage | `card`, `badge`, `button`, `table` |
| `/demo/projects` | project workspace list and actions | `toggle-group`, `dialog`, `menu`, `table` |
| `/demo/pipelines` | pipeline execution visibility | `card`, `progress`, `badge`, `skeleton` |
| `/demo/deployments` | deployment planning and rollout | `carousel`, `card`, `badge`, `button` |
| `/demo/services` | service catalog and health state | `card`, `badge`, `menu`, `switch` |
| `/demo/monitoring` | live metrics and alert rules | `search-input`, `slider`, `switch`, `table` |

### Team and Workspace

| Route | Main Purpose | Primary Components |
|---|---|---|
| `/demo/members` | team member roster and role actions | `avatar`, `table`, `menu`, `dialog` |
| `/demo/schedule` | planning with dual-month calendar | `calendar`, `tabs`, `card`, `badge` |
| `/demo/activity` | timeline of team/system events | `card`, `badge`, `popover` |
| `/demo/tasks` | task tracking and quick edits | `checkbox`, `select`, `drawer`, `badge` |
| `/demo/documents` | document table + upload workflow | `file-input`, `table`, `breadcrumb`, `drawer` |
| `/demo/apps` | internal tools and environments | `card`, `tabs`, `badge`, `toggle` |
| `/demo/chats` | messaging workspace | `resizable`, `search-input`, `avatar`, `card` |
| `/demo/users` | user admin with CRUD dialog flows | `dialog`, `menu`, `table`, `input` |
| `/demo/help-center` | knowledge hub and grouped help nav | `nav-menu`, `accordion`, `hover-card`, `card` |

### Settings

- `/demo/settings/profile`
- `/demo/settings/account`
- `/demo/settings/appearance`
- `/demo/settings/notifications`
- `/demo/settings/display`

Settings pages are form-heavy and show practical use of:

- `input`, `select`, `switch`, `radio`, `checkbox`
- `otp-input` for account security flows
- confirmation actions via `dialog` / `menu`

### Auth and Error Templates (Standalone)

- `/demo/sign-in`
- `/demo/sign-in-2`
- `/demo/sign-up`
- `/demo/forgot-password`
- `/demo/401`, `/demo/403`, `/demo/404`, `/demo/500`, `/demo/503`

These are reusable templates for product teams.

## Sidebar Navigation Map (EN / NL)

Use this as the source of truth when generating or editing sidebar navigation labels.

| Group | EN | NL |
|---|---|---|
| Group label | General | Algemeen |
| Item | Dashboard | Dashboard |
| Item | Notifications | Meldingen |
| Group label | Development | Ontwikkeling |
| Item | Projects | Projecten |
| Item | Pipelines | Pijplijnen |
| Item | Deployments | Uitrol |
| Group label | Infrastructure | Infrastructuur |
| Item | Services | Diensten |
| Item | Monitoring | Monitoring |
| Group label | Team | Team |
| Item | Users | Gebruikers |
| Item | Members | Leden |
| Item | Schedule | Planning |
| Item | Activity | Activiteit |
| Group label | Workspace | Werkruimte |
| Item | Apps | Apps |
| Item | My Tasks | Mijn taken |
| Item | Documents | Documenten |
| Group label | Other | Overig |
| Item | Settings | Instellingen |
| Item | Auth | Authenticatie |
| Item | Errors | Fouten |
| Item | Chats | Chats |
| Item | Help Center | Helpcentrum |

## Per-Page Acceptance Checklist

Use these checks after page edits or when generating a similar dashboard.

### `/demo/dashboard`

- metric cards render non-empty values
- overview tabs change active state and content context
- no placeholder-only cards

### `/demo/projects`

- grid/list toggle changes layout immediately
- create/edit project dialogs open and close correctly
- project row actions from menus mutate visible data

### `/demo/pipelines`

- running pipeline shows active progress and step state
- completed/pending states are visually distinct
- skeleton/loading placeholders are only used when intended

### `/demo/deployments`

- carousel next/prev controls work on desktop and mobile
- deployment cards show version, env, and schedule
- action buttons trigger visible feedback

### `/demo/monitoring`

- command/search input filters or resolves commands
- slider values and switch toggles update table/state live
- alert severity badges and thresholds remain consistent

### `/demo/documents`

- breadcrumb path is visible above main content
- file upload appends file metadata into table rows
- drawer details open for selected document and close cleanly

### `/demo/chats`

- resizable panels can be dragged
- selecting a conversation updates thread content
- sending a message appends to active thread

### `/demo/users`

- add-user dialog cancel/save both work
- successful create closes dialog and adds row
- row menu actions (edit/delete) mutate visible rows

### `/demo/schedule`

- dual-month calendar is visible in one viewport
- date/range changes update schedule context
- schedule panels/tables respond to selected date range

### `/demo/help-center`

- nav-menu opens guide groups correctly
- accordion entries expand/collapse without overlap
- help cards/sections are grouped by topic, not random

## Shared Design Rules (Tokens, Spacing, Typography)

Keep these rules stable for visual consistency across generated pages:

- use semantic tokens only (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`)
- primary app spacing rhythm: `gap-4`, `gap-6`, `p-4`, `p-6`
- section containers: card-first composition (`sng-card` + header/content/footer)
- page heading pattern: `h1` + short subtitle/description below
- icon sizing:
  - nav/item icons: `size-4`
  - compact control icons: `size-3.5` to `size-4`
  - brand logo marks: fixed and visually consistent in shell and auth pages
- avoid hardcoded color values in page markup unless part of a documented theme swatch

## Sample State Schemas (Reference)

These are representative data shapes for AI-generated pages. Keep IDs stable and deterministic.

### Dashboard metrics

```ts
type DashboardMetric = {
  id: 'open-prs' | 'incidents' | 'deployments' | 'team-online';
  label: string;
  value: number;
  deltaText?: string;
  status?: 'healthy' | 'warning' | 'critical';
};
```

### Project list

```ts
type ProjectItem = {
  id: string;
  name: string;
  owner: string;
  environment: 'dev' | 'staging' | 'production';
  status: 'active' | 'paused' | 'archived';
  updatedAt: string;
};
```

### Pipeline run

```ts
type PipelineStep = {
  id: string;
  name: string;
  status: 'done' | 'running' | 'pending' | 'failed';
  duration?: string;
  log?: string;
};

type PipelineRun = {
  id: string;
  ref: string;
  progress: number; // 0..100
  steps: PipelineStep[];
};
```

### User admin row

```ts
type UserRow = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor' | 'viewer';
  team: string;
  status: 'active' | 'inactive';
  createdAt: string;
};
```

### Documents table row

```ts
type DocumentRow = {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'sheet' | 'slide' | 'image';
  owner: string;
  updatedAt: string;
  sizeLabel: string;
};
```

### Chat thread

```ts
type ChatMessage = {
  id: string;
  sender: 'me' | 'other' | 'system';
  text: string;
  at: string;
};

type ChatThread = {
  id: string;
  title: string;
  participants: string[];
  unreadCount: number;
  messages: ChatMessage[];
};
```

## Live-Behavior Contracts

The dashboard should feel active, not static. Preserve these behaviors:

- dialogs and drawers open/close from explicit state
- create/edit/delete actions mutate local arrays immediately
- filters update visible lists without reload
- sliders, switches, toggles, and tabs reflect state instantly
- chat send action appends messages into the active thread
- file upload action appends file metadata into the documents table
- calendar and schedule controls update visible planning context

## Component Coverage Reference

This dashboard intentionally uses almost all major `@shadng/sng-ui` families in realistic pages.

High-value examples:

- `search-input`: `monitoring`, `chats`
- `otp-input`: `settings/account`
- `file-input`: `documents`
- `calendar` (dual-month usage): `schedule`
- `resizable`: `chats`
- `breadcrumb`: `documents`
- `nav-menu`: `help-center`
- `carousel`: `deployments`
- `dialog` + `drawer`: `users`, `tasks`, `documents`, `projects`

## Component Docs Links

Use these links when generating or editing page implementations:

- https://shadng.js.org/ui/layout
- https://shadng.js.org/ui/table
- https://shadng.js.org/ui/dialog
- https://shadng.js.org/ui/drawer
- https://shadng.js.org/ui/menu
- https://shadng.js.org/ui/nav-menu
- https://shadng.js.org/ui/search-input
- https://shadng.js.org/ui/file-input
- https://shadng.js.org/ui/otp-input
- https://shadng.js.org/ui/calendar
- https://shadng.js.org/ui/resizable
- https://shadng.js.org/ui/tabs
- https://shadng.js.org/ui/toggle
- https://shadng.js.org/ui/switch
- https://shadng.js.org/ui/slider
- https://shadng.js.org/ui/accordion
- https://shadng.js.org/ui/popover
- https://shadng.js.org/ui/hover-card
- https://shadng.js.org/ui/carousel
- https://shadng.js.org/ui/breadcrumb

## Rebuild Recipe (For AI Generating a Similar Dashboard)

1. Build shell first (`layout` + sidebar + header + theme/lang controls).
2. Add route groups in this order: dashboard, operations, team/workspace, settings, auth/error.
3. For each page, start with `card` and `table` structure, then add interactive controls.
4. Keep state local with signals unless cross-page state is truly required.
5. Add i18n runtime mapping early so labels and navigation stay consistent in EN/NL.
6. Keep AI actions in header and point context to `https://shadng.js.org/ai/sng-dashboard.md`.
7. Ensure pages are useful independently, but visually consistent under one shell.

## Editing Rules for AI

- prefer small, local edits over broad refactors
- preserve existing route names and page semantics unless explicitly requested
- keep interactions deterministic (no timing hacks)
- keep components readable and composable
- keep all user-facing text compatible with runtime translation mapping

## AI Action Wiring

- `AI Context` button opens this file URL
- `Ask AI` providers are prompted with this file as context

If this file is accurate, an external AI can understand structure, locate components quickly, and implement new dashboard pages with the same design language.

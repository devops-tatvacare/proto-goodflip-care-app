# GoodFlip Care - Copilot Instructions

## Project Overview

Next.js 15 healthcare companion app with React 19, TypeScript, Tailwind CSS, and shadcn/ui components. Uses pnpm for package management and implements a strict design system with custom linting rules.

## Build, Test, and Lint Commands

```bash
# Development
pnpm dev              # Start development server (port 3000)
pnpm build            # Production build
pnpm start            # Start production server

# Linting (run before committing)
pnpm lint             # ESLint for JavaScript/TypeScript
pnpm lint:css         # Stylelint for CSS/styles
pnpm lint:arbitrary   # Check for unannotated arbitrary Tailwind values
pnpm lint:all         # Run all linters

# Storybook
pnpm storybook        # Start Storybook on port 6008
pnpm build-storybook  # Build Storybook static files
```

## Architecture

### App Structure (Hybrid Routing)

- **Next.js App Router** (`app/`): Main layouts and API routes
- **Pages Router** (`pages/`): Legacy API routes only
- **Components** (`components/`): UI components organized by feature
  - `ui/` - shadcn/ui primitives and base components
  - `screens/` - Full-page components
  - `modals/`, `overlays/` - Modal and overlay components
  - Feature folders (e.g., `chat/`, `health-data/`, `insights/`)

### API Routes (`app/api/`)

Next.js App Router API routes return `NextResponse`:
- `chat/` - Chat session and message management
- `health/` - Health models status
- `insights/` - Health insights queries
- `logs/` - Symptom and activity logging
- `models/` - Model status endpoints
- `upload/` - File upload handling
- `dev/seed/` - Development data seeding

### Data Layer

- **SQLite Database** (`lib/db/sqlite.ts`): Local dev database with JSON fallback
  - Tables: sessions, messages, symptom_logs, activity_logs, events
  - Uses WAL mode for better concurrency
  - Dev database file: `health_dev.db` (or `health_dev.json` fallback)
- **Context Providers** (`contexts/`): React context for global state
  - `fab-context.tsx` - Floating Action Button state management

### Key Libraries

- **UI Components**: Radix UI primitives + shadcn/ui pattern
- **Forms**: react-hook-form with zod validation
- **Animations**: framer-motion
- **Audio**: wavesurfer.js, react-audio-visualize
- **Charts**: recharts
- **Date**: date-fns
- **Styling**: Tailwind CSS with CSS variables for theming

## Design System

### Strict Design Token Enforcement

This codebase enforces strict design system usage through automated linting:

**CSS Linting** (`.stylelintrc.js`):
- **No raw hex colors** - Use `var(--ds-*)` tokens only
- **No color keywords** - `red`, `blue`, etc. are forbidden
- **Custom properties must start with `ds-`** - e.g., `--ds-primary`, `--ds-spacing-md`
- Whitelisted files: Storybook stories and test files can bypass these rules

**Tailwind Linting** (`scripts/lint-arbitrary-values.js`):
- **No unannotated arbitrary values** - `text-[#3b82f6]`, `p-[16px]`, etc. require `/* @allow-arbitrary */` comment
- Encourages using design system classes: `ds-text-primary`, `ds-p-md`, `ds-rounded-lg`
- Run with `pnpm lint:arbitrary`

**ESLint Rules** (`.eslintrc.js`):
- **Inline styles discouraged** - Use CSS classes or styled-components
- Whitelisted files: `components/charts/**`, `components/body-selector/**`, Storybook stories

### Design Tokens Location

- **TypeScript tokens**: `lib/design-tokens.ts` (SPACING, SIZING, RADIUS, LAYOUT)
- **CSS variables**: `app/globals.css` (colors, transitions, motion presets)
- **Tailwind config**: `tailwind.config.ts` (theme extensions, semantic colors)

### When Adding Styles

1. **First choice**: Use existing design tokens from CSS variables or Tailwind config
2. **Second choice**: Add new token to design system (update `design-tokens.ts` or `globals.css`)
3. **Last resort**: Use arbitrary value with `/* @allow-arbitrary */` annotation and document why

## Key Conventions

### Path Aliases

All imports use `@/` alias (defined in `tsconfig.json`):
```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useVoiceRecording } from "@/hooks/useVoiceRecording"
```

### Component Organization

- **Primitives** (`components/primitives/`): Base UI building blocks
- **Screens** (`components/screens/`): Full-page components that compose multiple features
- **Feature Components**: Grouped by domain (e.g., `chat/`, `health-data/`)
- **UI Components** (`components/ui/`): shadcn/ui components - edit carefully, as they follow specific patterns

### Voice Recording Pattern

Multiple voice recording hooks exist with different capabilities:
- `useVoiceRecording.ts` - Base hook
- `use-voice-recording-unified.ts` - Unified interface
- `use-voice-recording-with-live-transcription.ts` - Live transcription support

Choose based on feature requirements.

### Database Access

SQLite database helper in `lib/db/sqlite.ts`:
- Use `getDb()` to access database connection
- Automatically falls back to JSON if SQLite unavailable
- Tables are auto-created on first access
- WAL mode enabled for better performance

### Accessibility

- Skip links implemented in root layout (`SkipLinks` component)
- Material Symbols font loaded for iconography
- ESLint jsx-a11y plugin enforces accessibility rules

## Common Tasks

### Adding a New API Route

1. Create route handler in `app/api/[feature]/route.ts`
2. Export async `GET`, `POST`, etc. functions
3. Return `NextResponse.json()` with data or error
4. Add database operations if needed via `getDb()`

### Adding a New UI Component

1. Create in `components/[feature]/` or `components/ui/`
2. Import design tokens from `@/lib/design-tokens`
3. Use Tailwind classes with CSS variable references
4. Ensure no inline styles (unless whitelisted file)
5. Run `pnpm lint:all` before committing

### Adding New Design Tokens

1. **For spacing/sizing**: Update `lib/design-tokens.ts`
2. **For colors**: Add CSS variable to `app/globals.css` with `--ds-` prefix
3. **For Tailwind utilities**: Extend `tailwind.config.ts` theme
4. Update Stylelint config if new patterns needed

### Working with Forms

Use react-hook-form + zod pattern:
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({ /* ... */ })
const form = useForm({ resolver: zodResolver(schema) })
```

## Build Configuration

- **TypeScript**: Strict mode enabled, ES6 target
- **Next.js**: Build errors ignored (typescript/eslint) - fix warnings in dev
- **Images**: Unoptimized mode enabled
- **Webpack**: Custom config removes Sucrase from CSS processing
- **Sharp**: Pinned to v0.33.5 in pnpm overrides

## Development Notes

- **Font**: Manrope variable font loaded from Google Fonts
- **Icons**: Material Symbols Outlined (loaded via CDN in layout)
- **Theme**: Dark mode support via class strategy
- **Instrumentation**: Next.js instrumentation.ts present (ML models removed)
- **Data**: Sample data in `lib/sample-data.ts`, RAG chunking in `lib/rag/`

## Storybook Configuration

Storybook 8.6.14 configured with:
- Next.js integration
- Accessibility addon (a11y)
- Themes addon for design system testing
- Chromatic integration for visual regression testing
- Output: `stories-storybook/storybook-static/`

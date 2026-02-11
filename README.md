# GoodFlip Care

> Your Companion for Comprehensive Healthcare

A modern healthcare companion application built with Next.js 15, React 19, and TypeScript. GoodFlip Care provides an intelligent health assistant interface with voice recording, symptom tracking, activity logging, and health insights.

## 🚀 Features

- **AI Health Assistant** - Conversational health companion with intelligent intent recognition
- **Voice Recording** - Multiple voice recording modes with live transcription support
- **Symptom Tracking** - Log and track symptoms with severity, location, and notes
- **Activity Logging** - Track physical activities with duration and intensity
- **Health Insights** - Query and visualize health data with interactive charts
- **Responsive Design** - Mobile-first design with PWA capabilities
- **Accessibility** - WCAG compliant with skip links and keyboard navigation
- **Design System** - Strict design token enforcement for consistent UI

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router + Pages Router hybrid)
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS with CSS variables
- **Components**: Radix UI primitives + shadcn/ui
- **Forms**: react-hook-form + Zod validation
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Audio**: WaveSurfer.js, react-audio-visualize
- **Database**: SQLite (better-sqlite3) with JSON fallback
- **Package Manager**: npm
- **Development**: Storybook 8 for component development

## 📋 Prerequisites

- Node.js 18.17 or later
- npm 10 or later
- Git

## 🏁 Getting Started

### Installation

```bash
# Clone the repository
git clone git@github.com:devops-tatvacare/proto-goodflip-care-app.git
cd proto-goodflip-care-app

# Install dependencies
npm install

# Copy environment variables (if needed)
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development Commands

```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server

# Linting
npm run lint          # Run ESLint
npm run lint:css      # Run Stylelint for CSS
npm run lint:arbitrary # Check Tailwind arbitrary values
npm run lint:all      # Run all linters

# Storybook
npm run storybook     # Start Storybook (port 6008)
npm run build-storybook # Build Storybook static files
npm run chromatic     # Run Chromatic visual tests
```

## 📁 Project Structure

```
proto-goodflip-care-app/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   ├── demo/                # Demo pages
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui base components
│   ├── screens/             # Full-page components
│   ├── chat/                # Chat feature components
│   ├── health-data/         # Health data components
│   ├── insights/            # Insights feature
│   └── primitives/          # Base UI primitives
├── contexts/                # React Context providers
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
│   ├── db/                  # Database layer
│   ├── rag/                 # RAG implementation
│   ├── types/               # TypeScript types
│   ├── constants/           # App constants
│   └── design-tokens.ts     # Design system tokens
├── pages/                   # Legacy Pages Router
│   └── api/                 # Legacy API routes
├── public/                  # Static assets
├── scripts/                 # Build scripts
└── data/                    # Data files
```

## 🎨 Design System

This project enforces a strict design system with automated linting:

### Rules

- **No raw hex colors** - Use CSS variables with `--ds-` prefix
- **No arbitrary Tailwind values without annotation** - Requires `/* @allow-arbitrary */` comment
- **No inline styles** - Use CSS classes or styled-components (except in whitelisted files)

### Design Tokens

- **TypeScript**: `lib/design-tokens.ts` - Spacing, sizing, radius, layout
- **CSS Variables**: `app/globals.css` - Colors, transitions, motion
- **Tailwind**: `tailwind.config.ts` - Theme extensions

See [Copilot Instructions](.github/copilot-instructions.md) for detailed guidelines.

## 🗄️ Database

Uses SQLite (better-sqlite3) for local development with automatic JSON fallback:

- **Dev database**: `health_dev.db`
- **Fallback**: `health_dev.json`
- **Tables**: sessions, messages, symptom_logs, activity_logs, events
- **Mode**: WAL (Write-Ahead Logging) for better performance

## 🔧 Configuration Files

- **TypeScript**: `tsconfig.json` - Strict mode, path aliases (`@/*`)
- **ESLint**: `.eslintrc.js` - Code quality rules
- **Stylelint**: `.stylelintrc.js` - CSS linting with design system enforcement
- **Tailwind**: `tailwind.config.ts` - Design tokens and theme
- **Next.js**: `next.config.mjs` - Build configuration
- **Storybook**: `.storybook/` - Component documentation
- **npm**: `package-lock.json` - Dependency lockfile

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes following the design system guidelines
3. Run `npm run lint:all` to ensure code quality
4. Commit with descriptive messages
5. Push and create a pull request

### Code Style

- Use TypeScript for all new files
- Follow the `@/` import alias convention
- Respect design token constraints
- Write accessible components (ARIA, semantic HTML)
- Add Storybook stories for new UI components

## 📚 Documentation

- [Copilot Instructions](.github/copilot-instructions.md) - Detailed development guidelines
- [Storybook](http://localhost:6008) - Component documentation (run `npm run storybook`)

## 🔐 Environment Variables

See `.env.local.example` for required environment variables.

## 📄 License

Proprietary - TatvaCare

## 👥 Authors

TatvaCare Development Team

---

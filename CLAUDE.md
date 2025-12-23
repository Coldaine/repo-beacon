# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## RepoBeacon

A VS Code extension for prominently displaying repository names with animated visual styles. "Peacock for people who need more."

**Current State:** React/Vite demo showcasing animations. Being restructured into a VS Code extension.

**Core Behavior:** Animation is event-triggered (window focus or timer), plays prominently over the editor, then disappears. Not persistent — designed to identify which window you just switched to.

## Required Reading

Before starting any work, read these documents:

1. **[docs/plans/DEVELOPMENT_PLAN.md](docs/plans/DEVELOPMENT_PLAN.md)** - Active 2-phase development plan, open questions
2. **[docs/VISION.md](docs/VISION.md)** - Mission, target users, design principles
3. **[docs/INTEGRATIONS.md](docs/INTEGRATIONS.md)** - Peacock and Project Manager integration

## Commands

```bash
# Demo (current)
npm i          # Install dependencies
npm run dev    # Start dev server (opens http://localhost:3000)
npm run build  # Production build to ./build

# Extension (after Phase 1.1 restructure)
# cd extension && npm i && npm run compile
# F5 in VS Code to launch Extension Host
```

## Architecture

### Development Plan

See [docs/plans/DEVELOPMENT_PLAN.md](docs/plans/DEVELOPMENT_PLAN.md) for the 2-phase plan:
- **Phase 1:** Working Extension (MVP) - Restructure, core extension, 3 animations
- **Phase 2:** Full Release - All 15 animations, integrations, marketplace

### Target Repo Structure (Post-Restructure)
```
repo-beacon/
├── extension/              # VS Code extension source
│   ├── src/
│   │   ├── extension.ts
│   │   ├── config/
│   │   ├── webview/
│   │   └── commands/
│   └── package.json        # Extension manifest
├── demo/                   # Original React demo (reference)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── VSCodeWindow.tsx
│   │   │   └── animations/   # 15 animation components
│   │   └── types/
│   └── package.json
├── docs/
│   └── plans/
│       └── DEVELOPMENT_PLAN.md
└── AGENTS.md
```

### Demo Structure (Current, Pre-Restructure)
```
src/
├── App.tsx                      # Main demo application
├── components/
│   ├── VSCodeWindow.tsx         # Window container, renders animations
│   ├── animations/              # 15 animation components
│   │   ├── DVDBounce.tsx
│   │   ├── Pulse.tsx
│   │   ├── Shimmer.tsx
│   │   └── ... (12 more)
│   └── ui/                      # shadcn/ui (do not modify)
└── types/
    └── ColorScheme.ts           # Color scheme definitions
```

### Animation Component Interface
All animations in `src/components/animations/` implement:
```typescript
interface AnimationProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}
```

### Color Schemes
Defined in `src/types/ColorScheme.ts`:
| Category | Colors | Typical Projects |
|----------|--------|------------------|
| frontend | Orange/Red | React, Vue, Angular |
| backend | Blue/Purple | APIs, Node, Python |
| data | Green/Teal | Data pipelines |
| devops | Cyan/Gray | Infrastructure |
| mobile | Pink | iOS, Android |
| testing | Yellow | Test suites |

## Path Alias

`@/` maps to `./src/` (configured in vite.config.ts)

## Key Decisions

- **Event-triggered, not persistent:** Animation plays on window focus (or timer), then disappears. NOT a constant overlay.
- **Standalone first:** Extension must work without Peacock or Project Manager
- **Integrate, don't isolate:** Play nicely with existing tools when present
- **Port animations, not React:** Animation logic transfers; React components become vanilla TS/CSS
- **Webview required:** Full-window overlay needs webview, not just decorations

## Workflow

### Branch Naming
```
phase{N}/{type}/{short-description}

Examples:
  phase1/feat/extension-scaffold
  phase1/feat/pulse-animation-port
  phase2/fix/auto-detect-bug
  docs/update-roadmap
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`

### Commit Messages
```
{type}: {short description}

Examples:
  feat: add pulse animation to webview
  fix: correct opacity in shimmer
  docs: mark Phase 1 complete
```

### Starting New Work
1. Check `docs/plans/DEVELOPMENT_PLAN.md` for current phase
2. Create branch from main
3. Implement, commit frequently
4. Test: `npm run dev` and `npm run build`
5. Update docs if needed (DEVELOPMENT_PLAN checkboxes, etc.)
6. Merge to main

### Updating Documentation
- Task done → check box in DEVELOPMENT_PLAN.md
- Architecture change → update this file
- New integration info → update INTEGRATIONS.md
- Vision changes rarely → VISION.md is stable

## Notes

- **Solo project:** Direct merge to main OK, PRs optional
- **AGENTS.md:** Symlink to this file for tools expecting that filename

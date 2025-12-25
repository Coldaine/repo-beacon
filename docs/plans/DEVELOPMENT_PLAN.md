# RepoBeacon Development Plan

> **Goal:** Transform the React/Vite animation demo into a fully functional VS Code extension.

## Core Behavior Model

The animation is **event-triggered, not persistent**:

- **Trigger:** Window activation (Alt+Tab into VS Code) OR configurable timer interval
- **Display:** Animation plays prominently ON TOP of the editor
- **Duration:** Animation plays once, then disappears
- **Purpose:** Immediately identify which repo you just switched to

This is intentionally **noticeable** — subtle is not the goal.

## Current State

We have a working **web demo** showcasing:
- 15 animation styles (React + Framer Motion)
- Color scheme system (6 categories, 10 variants)
- Visual design language

**This repo will be restructured** to become the VS Code extension, with the demo preserved as reference.

---

## Phase 1: Working Extension (MVP)

**Objective:** A VS Code extension that displays an animated repo name badge in a webview.

### 1.1 Project Restructure
- [x] Create `/extension` folder for VS Code extension source
- [x] Move demo to `/demo` folder (preserve as reference)
- [x] Initialize extension with proper `package.json` manifest
- [x] Set up TypeScript build pipeline for extension
- [x] Configure debugging (launch.json for Extension Host)

### 1.2 Core Extension Infrastructure
- [x] Create `extension.ts` with activation logic
- [x] Implement webview panel creation (full-window overlay)
- [x] Read workspace folder name via VS Code API
- [x] Basic settings schema in `package.json`
- [x] **Window focus detection** — trigger animation on window activate
- [x] Timer-based trigger option (e.g., every 30 seconds)
- [x] Auto-dismiss after animation completes

### 1.3 First Animations (Webview)
- [x] Port Pulse animation to vanilla CSS/JS
- [x] Port Shimmer animation
- [x] Port Fade animation
- [x] Create webview HTML template with animation switcher
- [x] Wire settings to webview (style, color scheme)

### 1.4 Commands & Configuration
- [x] Command: "RepoBeacon: Toggle Enabled"
- [x] Command: "RepoBeacon: Change Style"
- [x] Command: "RepoBeacon: Change Color Scheme"
- [x] Command: "RepoBeacon: Show Now" (manual trigger)
- [x] Per-workspace settings support
- [x] Settings: position, opacity, size, animation speed, trigger mode, timer interval

### 1.5 Phase 1 Deliverable
- Extension activates on workspace open
- Animation triggers on window focus (Alt+Tab) or timer
- Shows repo name with animated overlay, then auto-dismisses
- 3 working animation styles
- Configurable via settings and commands
- Installable via `.vsix` for testing

**Target:** Functional extension that solves the "which window is this?" problem.

---

## Phase 2: Full Release

**Objective:** Production-ready extension with all features, integrations, and marketplace presence.

### 2.1 Complete Animation Library
- [ ] Port remaining 12 animations to vanilla CSS/JS
- [ ] Ensure consistent animation interface
- [ ] Reduced motion support (respect OS accessibility setting)

### 2.2 Smart Defaults & Auto-Detection
- [ ] Auto-detect project type (package.json, Cargo.toml, go.mod, etc.)
- [ ] Map detected type to color scheme
- [ ] Infer display name from git remote, folder, or package name
- [ ] "Random style" option

### 2.3 Integrations (Optional)
- [ ] Detect Peacock installation, offer color inheritance
- [ ] Detect Project Manager, offer import
- [ ] Tag-to-style mapping configuration

### 2.4 Polish & UX
- [ ] Welcome/onboarding flow
- [ ] Quick picker with style previews
- [ ] Settings GUI (webview config panel)
- [ ] Light/dark theme handling

### 2.5 Marketplace Launch
- [ ] Cross-platform testing (Windows, macOS, Linux)
- [ ] Write marketplace description & screenshots
- [ ] Create demo GIF
- [ ] Publish to VS Code Marketplace
- [ ] Publish to Open VSX

### 2.6 Phase 2 Deliverable
- All 15 animations working
- Integrations with Peacock & Project Manager
- Published on Marketplace
- Documentation and community setup

---

## Repo Structure (Target)

```
repo-beacon/
├── extension/                 # VS Code extension source
│   ├── src/
│   │   ├── extension.ts       # Entry point
│   │   ├── config/
│   │   │   ├── settings.ts
│   │   │   └── detection.ts
│   │   ├── webview/
│   │   │   ├── panel.ts
│   │   │   └── content/       # HTML/CSS/JS for webview
│   │   │       ├── index.html
│   │   │       ├── styles.css
│   │   │       └── animations/
│   │   └── commands/
│   ├── package.json           # Extension manifest
│   └── tsconfig.json
├── demo/                      # Original React demo (reference)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── plans/
│   │   └── DEVELOPMENT_PLAN.md
│   ├── VISION.md
│   ├── INTEGRATIONS.md
│   └── ROADMAP.md             # (deprecated, points to this plan)
├── AGENTS.md
└── README.md
```

---

## Open Questions

### Technical (Need Research)
1. **Window Focus API:** Does VS Code expose a reliable event for window activation? Need to verify `vscode.window.onDidChangeWindowState` works for Alt+Tab detection.

2. **Full-Window Webview Overlay:** Can we create a webview that overlays the entire editor area (not a side panel)? May need to explore `WebviewView` vs `WebviewPanel` positioning options.

3. **Animation Portability:** The demo uses Framer Motion (React). Webviews support standard web tech, so CSS animations + vanilla JS should work. Need to verify during porting.

### Deferred (Not Phase 1)
- Multi-root workspaces — handle later if needed
- Remote/Container/WSL — VS Code extensions run client-side, likely no special handling needed
- Theme compatibility (light/dark) — nice-to-have, not MVP
- Peacock/Project Manager integrations — Phase 2

### Resolved ✓
- ~~Webview vs Decorations~~ → Webview (need full-window overlay capability)
- ~~Animation performance~~ → Don't pre-optimize, make it work first
- ~~UX defaults (position, opacity, speed)~~ → All configurable, ship reasonable defaults
- ~~Always-on-top / persistence~~ → Not persistent; event-triggered, plays once, disappears

---

## Timeline Estimates

| Milestone | Estimate |
|-----------|----------|
| Phase 1.1 (Restructure) | 1-2 days |
| Phase 1.2-1.4 (Core Extension) | 1-2 weeks |
| Phase 1 Complete | ~2 weeks |
| Phase 2 (Full Release) | 3-4 weeks |
| **Total to Marketplace** | **5-6 weeks** |

---

## Code Review Notes (Phase 1)

Issues identified and fixed during code review:

### Fixed ✓
- **Added CSP header** — Webview now has Content-Security-Policy meta tag for security
- **Added proper logging** — Replaced `console.log` with `LogOutputChannel` via `createOutputChannel`
- **Fixed timer memory leak** — Config listener now also responds to `repoBeacon.enabled` changes
- **Fixed entrance animation bug** — Position-specific transforms now used in keyframes (was hardcoded to center)
- **Added hex color validation** — Custom colors now validate properly, support 3-char shorthand, fallback on invalid
- **Added error handling** — `BeaconPanel.show()` wrapped in try-catch to prevent extension crashes
- **Replaced magic number** — Initial show delay now uses named constant `INITIAL_SHOW_DELAY_MS`

### Known Limitations (Document for Users)
- **Webview opens in editor column** — Not a true overlay; takes over `ViewColumn.One`. Future: investigate overlay techniques or accept as current UX.
- **Auto-detect not implemented** — `colorScheme: 'auto'` falls back to `backend` colors. Phase 2 will add project type detection.

---

## Next Actions

1. ~~Create `phase1/feat/restructure` branch~~ ✓
2. ~~Move demo code to `/demo`~~ ✓
3. ~~Scaffold VS Code extension in `/extension`~~ ✓
4. ~~Get "Hello World" webview working~~ ✓
5. ~~Port Pulse animation as proof of concept~~ ✓
6. **Test extension manually** (F5 launch)
7. **Commit code review fixes**
8. **Merge to master when ready**

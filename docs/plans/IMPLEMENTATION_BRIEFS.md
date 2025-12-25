# RepoBeacon Implementation Briefs

> **Status:** Ready for parallel prototyping  
> **Date:** December 24, 2025  
> **Architecture Decision:** Native sidecar app (Tauri) controlled by VS Code extension via IPC

---

## Mission Statement

**RepoBeacon** displays a prominent, animated overlay showing the repository name when you switch to a VS Code window. The overlay covers the ENTIRE VS Code window (not confined to an editor panel), plays an animation, and auto-dismisses.

**Core UX:**
1. User Alt+Tabs to a VS Code window
2. A full-window overlay appears showing "my-project-name" with animation (DVD bounce, pulse, matrix rain, etc.)
3. After 2-3 seconds, overlay fades out
4. User immediately knows which repo they're in

**Why a sidecar app?**  
VS Code's extension API cannot create UI that overlays the entire window. Extensions are sandboxed to webview panels, status bars, and decorations. To achieve full-window coverage, we spawn a separate native app (Tauri) that renders a transparent, always-on-top window positioned exactly over VS Code.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        VS Code Window                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Extension Host                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  RepoBeacon Extension                               │  │  │
│  │  │  - Detects window focus (onDidChangeWindowState)    │  │  │
│  │  │  - Reads workspace name                             │  │  │
│  │  │  - Reads user settings (animation, color, etc.)     │  │  │
│  │  │  - Spawns & communicates with overlay process       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              │ stdin/stdout IPC                 │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Tauri Overlay App (sidecar)                              │  │
│  │  - Transparent, frameless window                          │  │
│  │  - Positions itself over parent VS Code window            │  │
│  │  - Renders animations via WebView                         │  │
│  │  - Auto-dismisses after animation completes               │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Key insight:** Each VS Code window runs its own Extension Host, so each window spawns its own overlay. No coordination needed between windows.

---

## Brief A: VS Code Extension (The Controller)

### Objective
Build the VS Code extension that detects window events and controls the overlay.

### Responsibilities
1. **Activation:** Start on VS Code startup (`onStartupFinished`)
2. **Overlay lifecycle:** Spawn overlay process on activation, kill on deactivation
3. **Focus detection:** Listen to `vscode.window.onDidChangeWindowState`
4. **Settings:** Read user configuration (animation style, color scheme, duration, etc.)
5. **Commands:** Provide command palette commands (Show Now, Change Style, Toggle)
6. **IPC:** Send JSON commands to overlay via stdin

### Key Files
```
extension/
├── src/
│   ├── extension.ts          # Activation, deactivation, event listeners
│   ├── overlay/
│   │   ├── manager.ts        # Spawns and manages overlay process
│   │   └── protocol.ts       # IPC message types and serialization
│   ├── config/
│   │   └── settings.ts       # Read VS Code configuration
│   └── commands/
│       └── index.ts          # Command palette commands
└── package.json              # Extension manifest
```

### IPC Protocol (Extension → Overlay)

```typescript
// Commands sent from extension to overlay
type OverlayCommand =
  | { type: 'SHOW'; payload: { repoName: string; style: string; colorScheme: string; duration: number } }
  | { type: 'HIDE' }
  | { type: 'CONFIG'; payload: { opacity: number; fontSize: string; position: string } }
  | { type: 'SHUTDOWN' };

// Responses from overlay to extension (optional, for debugging)
type OverlayResponse =
  | { type: 'READY' }
  | { type: 'SHOWN' }
  | { type: 'HIDDEN' }
  | { type: 'ERROR'; message: string };
```

### Spawn Pattern

```typescript
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

class OverlayManager {
  private process: ChildProcess | undefined;
  
  start(overlayBinaryPath: string): void {
    this.process = spawn(overlayBinaryPath, [], {
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    
    this.process.stdout?.on('data', (data) => {
      // Parse responses if needed
    });
    
    this.process.on('exit', () => {
      this.process = undefined;
    });
  }
  
  send(command: OverlayCommand): void {
    if (this.process?.stdin) {
      this.process.stdin.write(JSON.stringify(command) + '\n');
    }
  }
  
  stop(): void {
    this.send({ type: 'SHUTDOWN' });
    this.process?.kill();
  }
}
```

### Settings Schema (package.json contributes.configuration)

```json
{
  "repoBeacon.enabled": { "type": "boolean", "default": true },
  "repoBeacon.style": { "type": "string", "enum": ["dvd-bounce", "pulse", "shimmer", "matrix", "typewriter", "fade"], "default": "pulse" },
  "repoBeacon.colorScheme": { "type": "string", "enum": ["auto", "frontend", "backend", "data", "devops", "mobile", "custom"], "default": "auto" },
  "repoBeacon.customColor": { "type": "string", "default": "#3b82f6" },
  "repoBeacon.duration": { "type": "number", "default": 3000, "minimum": 1000, "maximum": 10000 },
  "repoBeacon.triggerOnFocus": { "type": "boolean", "default": true },
  "repoBeacon.opacity": { "type": "number", "default": 0.9, "minimum": 0.1, "maximum": 1.0 },
  "repoBeacon.fontSize": { "type": "string", "default": "4rem" }
}
```

### Test Scenarios
- [ ] Extension activates and spawns overlay
- [ ] Focus event triggers SHOW command
- [ ] Settings changes are sent as CONFIG command
- [ ] Overlay process crash triggers respawn
- [ ] Extension deactivation kills overlay cleanly
- [ ] Multiple VS Code windows each have their own overlay

### Open Questions
1. Where is the overlay binary stored? Bundled in extension? Downloaded on first run?
2. How do we handle platform-specific binaries (Windows/Mac/Linux)?

---

## Brief B: Tauri Overlay App (The Display)

### Objective
Build the Tauri app that renders the animated overlay positioned over VS Code.

### Responsibilities
1. **Window management:** Create transparent, frameless, always-on-top window
2. **Positioning:** Find parent VS Code window and match its bounds
3. **Animation rendering:** Display animated text via WebView (HTML/CSS/JS)
4. **IPC listener:** Read JSON commands from stdin
5. **Auto-dismiss:** Hide after animation duration

### Key Files
```
overlay/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs           # Tauri entry point, window creation
│   │   ├── ipc.rs            # stdin reader, command parsing
│   │   └── window_finder.rs  # OS-specific window positioning
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/                       # Frontend (WebView content)
│   ├── index.html
│   ├── styles.css
│   ├── animations/
│   │   ├── dvd-bounce.ts
│   │   ├── pulse.ts
│   │   ├── shimmer.ts
│   │   ├── matrix.ts
│   │   └── ...
│   └── main.ts               # Receives commands from Tauri backend
└── package.json
```

### Window Configuration (Tauri)

```rust
// src-tauri/src/main.rs
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            
            // Transparent, frameless, click-through
            window.set_decorations(false)?;
            window.set_always_on_top(true)?;
            window.set_skip_taskbar(true)?;
            // Note: transparency is set in tauri.conf.json
            
            // Start hidden
            window.hide()?;
            
            // Start stdin listener
            std::thread::spawn(move || {
                ipc::listen_stdin(app.handle());
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Window Positioning Strategy

**Goal:** Position the overlay exactly over the VS Code window that spawned it.

**Approach:** Use the parent process ID to find the VS Code window.

```rust
// Pseudocode - actual implementation is OS-specific
fn find_parent_vscode_window() -> Option<WindowBounds> {
    let parent_pid = std::os::unix::process::parent_id(); // or Windows equivalent
    
    // Use OS APIs to enumerate windows and find one owned by parent_pid
    // Windows: EnumWindows + GetWindowThreadProcessId
    // macOS: CGWindowListCopyWindowInfo
    // Linux: X11/Wayland APIs
    
    get_window_bounds_for_pid(parent_pid)
}
```

**Libraries to consider:**
- `active-win` (Node, but there are Rust equivalents)
- `windows-rs` for Windows APIs
- `core-graphics` for macOS
- `x11rb` for Linux X11

### Frontend Animation Interface

```typescript
// src/main.ts
interface ShowPayload {
  repoName: string;
  style: string;
  colorScheme: string;
  duration: number;
}

// Receive commands from Tauri backend
window.__TAURI__.event.listen('show-overlay', (event: { payload: ShowPayload }) => {
  const { repoName, style, colorScheme, duration } = event.payload;
  
  // Select animation module
  const animator = getAnimator(style); // dvd-bounce, pulse, etc.
  
  // Apply color scheme
  applyColors(colorScheme);
  
  // Run animation
  animator.start(repoName);
  
  // Auto-hide after duration
  setTimeout(() => {
    animator.stop();
    window.__TAURI__.invoke('hide_window');
  }, duration);
});
```

### Test Scenarios
- [ ] Overlay appears exactly over VS Code window
- [ ] Overlay is transparent (code shows through)
- [ ] Overlay is click-through (mouse events pass to VS Code)
- [ ] Each animation style renders correctly
- [ ] Color schemes apply correctly
- [ ] Overlay hides after duration
- [ ] Overlay handles rapid show/hide commands
- [ ] Works on Windows/macOS/Linux

### Open Questions
1. Click-through behavior: Should overlay be fully click-through, or have a dismiss button?
2. Multi-monitor: What if VS Code is on secondary monitor?
3. Accessibility: Respect reduced-motion preferences?

---

## Brief C: Integration & Testing (The Glue)

### Objective
Ensure the extension and overlay work together reliably across all scenarios.

### Responsibilities
1. **IPC protocol validation:** Ensure both sides speak the same language
2. **Build pipeline:** Bundle overlay binary with extension
3. **Platform matrix:** Test on Windows, macOS, Linux
4. **Error handling:** Graceful degradation if overlay fails
5. **Performance:** Measure startup latency, memory usage

### IPC Protocol Specification

```
┌─────────────────────────────────────────────────────────────────┐
│                     IPC PROTOCOL v1.0                           │
├─────────────────────────────────────────────────────────────────┤
│  Transport: stdin/stdout                                        │
│  Format: Newline-delimited JSON (NDJSON)                        │
│  Direction: Bidirectional                                       │
└─────────────────────────────────────────────────────────────────┘

EXTENSION → OVERLAY:

  SHOW
  {"type":"SHOW","payload":{"repoName":"my-repo","style":"pulse","colorScheme":"backend","duration":3000}}
  
  HIDE
  {"type":"HIDE"}
  
  CONFIG
  {"type":"CONFIG","payload":{"opacity":0.9,"fontSize":"4rem"}}
  
  SHUTDOWN
  {"type":"SHUTDOWN"}

OVERLAY → EXTENSION:

  READY (sent once on startup)
  {"type":"READY"}
  
  ACK (optional, confirms command received)
  {"type":"ACK","command":"SHOW"}
  
  ERROR
  {"type":"ERROR","message":"Failed to find parent window"}
```

### Build & Bundle Strategy

```
repo-beacon/
├── extension/                  # VS Code extension
│   └── package.json
├── overlay/                    # Tauri app
│   └── src-tauri/
└── scripts/
    ├── build-overlay.sh        # Build Tauri for all platforms
    ├── bundle-extension.sh     # Copy binaries into extension, build .vsix
    └── ci.yml                  # GitHub Actions workflow

Binary locations in extension:
  extension/
  └── bin/
      ├── overlay-win32-x64.exe
      ├── overlay-darwin-x64
      ├── overlay-darwin-arm64
      └── overlay-linux-x64
```

### Error Handling Matrix

| Scenario | Extension Behavior | User Feedback |
|----------|-------------------|---------------|
| Overlay binary missing | Log error, disable feature | "Overlay not available" status bar |
| Overlay crashes | Attempt respawn (max 3x) | Silent if respawn succeeds |
| Overlay unresponsive | Kill and respawn | Silent |
| IPC parse error | Log, ignore malformed message | None |
| Window not found | Overlay shows at screen center | "Could not detect VS Code window" in overlay |

### Test Matrix

| Test Case | Windows | macOS | Linux |
|-----------|---------|-------|-------|
| Extension activates | | | |
| Overlay spawns | | | |
| Focus triggers show | | | |
| Overlay positions correctly | | | |
| Animation renders | | | |
| Auto-dismiss works | | | |
| Multi-window isolation | | | |
| Settings sync | | | |
| Clean shutdown | | | |
| Crash recovery | | | |

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Overlay startup (cold) | < 500ms | Time from spawn to READY |
| Show latency | < 100ms | Time from SHOW command to visible |
| Memory (idle) | < 50MB | Overlay process when hidden |
| Memory (active) | < 100MB | Overlay process during animation |
| Extension bundle size | < 20MB | .vsix file with all binaries |

### Open Questions
1. Should we download binaries on first run instead of bundling? (Smaller initial install)
2. How do we handle VS Code running in WSL or Remote SSH?
3. Should there be a "test mode" that shows overlay bounds without animation?

---

## Prototype Priorities

For initial prototyping, focus on:

### Phase 0: Proof of Concept (1-2 days)
- [ ] **Brief B:** Tauri app that shows a transparent window with hardcoded text
- [ ] **Brief B:** Tauri app can find and position over ANY active window
- [ ] **Brief A:** Extension spawns a process and sends stdin messages
- [ ] **Integration:** Extension triggers Tauri to show overlay on focus

### Phase 1: MVP (1 week)
- [ ] **Brief B:** 3 working animations (pulse, shimmer, fade)
- [ ] **Brief A:** Full settings schema wired up
- [ ] **Brief C:** Windows + macOS builds

### Phase 2: Polish (1 week)
- [ ] **Brief B:** All 15 animations ported
- [ ] **Brief A:** Peacock/Project Manager integration
- [ ] **Brief C:** Linux build, error handling, performance optimization

---

## Appendix: Animation Reference

The existing demo (`/demo`) has 15 animations implemented in React/Framer Motion. These need to be ported to vanilla CSS/JS for the Tauri WebView:

| Animation | Demo File | Complexity | Notes |
|-----------|-----------|------------|-------|
| Pulse | `Pulse.tsx` | Low | Pure CSS keyframes |
| Shimmer | `Shimmer.tsx` | Low | CSS gradient animation |
| Fade | `Fade.tsx` | Low | CSS opacity animation |
| Neon Pulse | `NeonPulse.tsx` | Low | CSS text-shadow animation |
| Typewriter | `Typewriter.tsx` | Medium | JS character-by-character reveal |
| Wave | `Wave.tsx` | Medium | CSS with per-character delay |
| Glitch | `Glitch.tsx` | Medium | CSS with clip-path |
| DVD Bounce | `DVDBounce.tsx` | Medium | JS position animation |
| Horizontal Scroll | `HorizontalScroll.tsx` | Low | CSS marquee |
| Vertical Scroll | `VerticalScroll.tsx` | Low | CSS marquee |
| Diagonal Slide | `DiagonalSlide.tsx` | Low | CSS transform animation |
| Flip 3D | `Flip3D.tsx` | Medium | CSS 3D transforms |
| Circular Orbit | `CircularOrbit.tsx` | High | JS trigonometry for path |
| Color Sweep | `ColorSweep.tsx` | Low | CSS gradient animation |
| Matrix Rain | `MatrixRain.tsx` | High | JS canvas or many DOM elements |

---

## Getting Started

To begin prototyping, agents should:

1. **Read this document** in full
2. **Read `/docs/VISION.md`** for product context
3. **Run the demo** (`cd demo && npm i && npm run dev`) to see animations
4. **Pick a brief** (A, B, or C) and start building

Questions? Check `/docs/plans/DEVELOPMENT_PLAN.md` for additional context on the original webview approach (which we're now replacing).

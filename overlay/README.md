# RepoBeacon Overlay (Tauri)

This directory will contain the Tauri application that serves as the overlay for RepoBeacon.

## Architecture

The overlay is a "sidecar" application spawned by the VS Code extension. It creates a transparent, always-on-top window that positions itself over the VS Code window and displays the repository name animation.

## Structure (Planned)

```
overlay/
├── src-tauri/          # Rust backend (window management, IPC)
├── src/                # Frontend (animations, ported from demo)
└── package.json
```

See `../docs/plans/IMPLEMENTATION_BRIEFS.md` for full implementation details.

# Integration Strategy

## Philosophy

**Integrate, don't isolate.** This extension should:
- Work standalone with zero dependencies
- Enhance the experience for users of popular extensions
- Never require another extension to function
- Reward users who have complementary tools installed

## Peacock Integration

### What Peacock Does
[Peacock](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock) (5M+ installs) colors VS Code's UI elements:
- Title bar
- Activity bar
- Status bar

It stores settings in workspace `.vscode/settings.json`:
```json
{
  "peacock.color": "#42b883",
  "workbench.colorCustomizations": {
    "activityBar.background": "#42b883",
    "titleBar.activeBackground": "#42b883",
    "statusBar.background": "#359268"
  }
}
```

### Integration Approach: Complementary Enhancement

RepoBeacon's animation is **event-triggered** (plays on window focus, then disappears), while Peacock's colors are **persistent**. They complement each other:

```
┌─────────────────────────────────────────────────────────────┐
│  Title Bar (Peacock teal)                                   │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┐                                                 │
│ │ Activity│                                                 │
│ │   Bar   │              ╭─────────────────╮                │
│ │  (teal) │              │  my-frontend    │ ← ON FOCUS     │
│ │         │              │  (animating...) │   plays then   │
│ │         │              ╰─────────────────╯   disappears   │
│ │         │                                                 │
│ └─────────┘        Peacock = persistent color               │
│                    RepoBeacon = transient animation         │
├─────────────────────────────────────────────────────────────┤
│  Status Bar (Peacock teal)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Integration Features

#### 1. Color Inheritance (Optional)
If Peacock is installed and configured, offer to use its color as the base:

```
Detected Peacock color: #42b883
[ ] Use Peacock color for repo badge
[x] Use category-based color scheme
```

#### 2. Peacock Color Sync
When user sets a color in our extension, optionally sync to Peacock:

```typescript
// If user enables "Sync with Peacock"
if (peacockInstalled && syncEnabled) {
  vscode.workspace.getConfiguration('peacock').update('color', ourColor);
}
```

#### 3. Peacock Detection
```typescript
async function detectPeacock(): Promise<PeacockConfig | null> {
  const peacockExt = vscode.extensions.getExtension('johnpapa.vscode-peacock');
  if (!peacockExt) return null;

  const config = vscode.workspace.getConfiguration('peacock');
  return {
    installed: true,
    color: config.get('color'),
    affectedElements: config.get('affectedElements')
  };
}
```

### What We DON'T Do
- Don't require Peacock
- Don't conflict with Peacock settings
- Don't duplicate Peacock's UI coloring functionality
- Don't fork or embed Peacock code

---

## Project Manager Integration

### What Project Manager Does
[Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager) (6.7M installs) manages multiple projects:
- Sidebar with project list
- Tags for organization
- Auto-detection of git repos
- Quick switching between projects

It stores projects in:
- Global: `~/.vscode/globalStorage/alefragnani.project-manager/projects.json`
- Or per settings configuration

```json
[
  {
    "name": "my-frontend",
    "rootPath": "C:\\Projects\\my-frontend",
    "tags": ["client-a", "react"],
    "enabled": true
  },
  {
    "name": "my-api",
    "rootPath": "C:\\Projects\\my-api",
    "tags": ["client-a", "node"],
    "enabled": true
  }
]
```

### Integration Approach: Optional Enhancement

```
┌─────────────────────────────────────────────────────────┐
│                  Project Manager                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Projects                                        │    │
│  │  ├── my-frontend     [react] [client-a]         │    │
│  │  ├── my-api          [node] [client-a]          │    │
│  │  └── infra-scripts   [devops]                   │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Our Extension (if PM detected)              │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Import Projects from Project Manager?           │    │
│  │  [ Import All ] [ Select Projects ]              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Imported projects get default visual styles based on   │
│  their tags:                                            │
│    - [react] → Frontend color scheme                    │
│    - [node] → Backend color scheme                      │
│    - [devops] → DevOps color scheme                     │
└─────────────────────────────────────────────────────────┘
```

### Integration Features

#### 1. Project Import
One-click import of Project Manager's project list:

```typescript
async function importFromProjectManager(): Promise<Project[]> {
  const pmExt = vscode.extensions.getExtension('alefragnani.project-manager');
  if (!pmExt) return [];

  // Read PM's project storage
  const globalStoragePath = context.globalStorageUri.fsPath
    .replace('our-extension-id', 'alefragnani.project-manager');
  const projectsFile = path.join(globalStoragePath, 'projects.json');

  if (await fs.exists(projectsFile)) {
    return JSON.parse(await fs.readFile(projectsFile, 'utf8'));
  }
  return [];
}
```

#### 2. Tag-Based Style Assignment
Map Project Manager tags to visual styles:

```json
{
  "repoBeacon.tagMappings": {
    "react": { "colorScheme": "frontend", "style": "shimmer" },
    "vue": { "colorScheme": "frontend", "style": "pulse" },
    "node": { "colorScheme": "backend", "style": "neon-pulse" },
    "python": { "colorScheme": "backend", "style": "typewriter" },
    "devops": { "colorScheme": "devops", "style": "matrix-rain" },
    "data": { "colorScheme": "data", "style": "wave" }
  }
}
```

#### 3. Sync Detection
Watch for Project Manager changes and prompt to sync:

```typescript
// When PM adds a new project
vscode.workspace.onDidChangeConfiguration(e => {
  if (e.affectsConfiguration('projectManager')) {
    promptSyncNewProjects();
  }
});
```

### Standalone Fallback

When Project Manager is NOT installed:

```
┌─────────────────────────────────────────────────────────┐
│                    Our Extension                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  No Project Manager detected                     │    │
│  │                                                  │    │
│  │  Options:                                        │    │
│  │  [1] Auto-detect Git repos in folder             │    │
│  │  [2] Manually add projects                       │    │
│  │  [3] Configure current workspace only            │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

Auto-detection approach:
```typescript
async function autoDetectRepos(rootPath: string): Promise<string[]> {
  // Find all directories containing .git
  const gitDirs = await glob('**/.git', {
    cwd: rootPath,
    ignore: ['**/node_modules/**'],
    onlyDirectories: true
  });

  return gitDirs.map(g => path.dirname(g));
}
```

---

## Configuration Storage

### Our Settings Structure

```json
// .vscode/settings.json (per-workspace)
{
  "repoBeacon.style": "shimmer",
  "repoBeacon.colorScheme": "frontend",
  "repoBeacon.customColor": null,
  "repoBeacon.position": "top-right",
  "repoBeacon.opacity": 0.85,
  "repoBeacon.enabled": true
}
```

```json
// Global settings (user settings.json)
{
  "repoBeacon.defaultStyle": "pulse",
  "repoBeacon.syncWithPeacock": false,
  "repoBeacon.importFromProjectManager": true,
  "repoBeacon.tagMappings": { ... },
  "repoBeacon.projects": [
    {
      "path": "C:\\Projects\\my-frontend",
      "name": "my-frontend",
      "style": "shimmer",
      "colorScheme": "frontend"
    }
  ]
}
```

---

## Integration Priority

| Integration | Priority | Complexity | Value |
|-------------|----------|------------|-------|
| Standalone (no deps) | P0 | Low | Must work alone |
| Project Manager import | P1 | Medium | High for power users |
| Peacock color detection | P2 | Low | Nice-to-have |
| Peacock color sync | P3 | Low | Nice-to-have |
| PM tag auto-mapping | P2 | Medium | Reduces config burden |

---

## Future Integration Possibilities

### GitLens
Could potentially read repository info for automatic naming/categorization.

### Remote Development
Ensure overlays work in:
- Remote SSH
- WSL
- Dev Containers
- GitHub Codespaces

### Multi-root Workspaces
Handle workspaces with multiple folders, potentially showing different badges per folder.

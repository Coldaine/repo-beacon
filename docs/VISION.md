# Vision & Mission

## The Problem

Developers frequently work with multiple VS Code windows open simultaneously. The cognitive load of identifying which window contains which project creates friction:

- Alt+Tab cycling through windows hoping to land on the right one
- Squinting at tiny text in title bars
- Opening the wrong window and losing focus
- Mental overhead that compounds throughout the day

**Peacock** addresses this with subtle UI color changes (title bar, status bar, activity bar). For many users, this works great. But for others:

- Color differences are too subtle to register at a glance
- They need **text-based identification**, not just color cues
- Visual processing differences mean they need bolder, more prominent signals
- They want something that **catches the eye immediately**

## The Solution

A VS Code extension that **prominently displays the project/repository name** using highly visible, configurable visual styles.

This is **Peacock for people who need more**.

### Core Concept

An **event-triggered animation** that shows your project name when you switch to a window:

```
┌─────────────────────────────────────────────────────┐
│  ○ ○ ○   App.tsx                        [Frontend]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│   import React from 'react';                        │
│   import { Button } from './ui';                    │
│                     ╭─────────────────────╮         │
│   export default fu │    my-api-repo      │ {       │
│     return <div>Hel │    (animating...)   │         │
│   }                 ╰─────────────────────╯         │
│                              ↑                      │
│                    plays on window focus,           │
│                    then disappears                  │
├─────────────────────────────────────────────────────┤
│  main  •  TypeScript                      Ln 5 Col 8│
└─────────────────────────────────────────────────────┘
```

**Trigger behavior:**
- Animation plays when you Alt+Tab into the window
- OR on a configurable timer interval
- Animation completes, then overlay disappears
- You immediately know which repo you're in

## Target Users

1. **Multi-project developers** - Anyone juggling 3+ repos simultaneously
2. **Visually-oriented thinkers** - People who need bold visual cues, not subtle hints
3. **Peacock users who want more** - Complementary enhancement, not replacement
4. **Context-switch heavy workflows** - Microservices, monorepos, client work

## Design Principles

### 1. Noticeable, not persistent
The animation should be **impossible to miss** when it plays — that's the point. But it plays on events, not constantly, so it doesn't obstruct your work.

### 2. Simple defaults, deep customization
Works beautifully out of the box. Power users can tweak everything (position, opacity, animation speed, trigger behavior, colors).

### 3. Integrate, don't isolate
Play nicely with existing tools (Peacock, Project Manager) rather than replacing them.

### 4. Respect user choice
Multiple display styles because different people process visual information differently. What works for one user may not work for another.

## Display Styles

15 distinct animation/display modes (with more possible):

| Style | Description | Best For |
|-------|-------------|----------|
| DVD Bounce | Bouncing badge like classic screensaver | Playful, attention-grabbing |
| Horizontal Scroll | Marquee ticker effect | Long repo names |
| Pulse | Breathing/pulsing glow | Subtle but visible |
| Shimmer | Shiny sweep effect | Professional, modern |
| Neon Pulse | Glowing neon sign effect | High visibility |
| Typewriter | Typing animation | Distinctive, retro |
| Glitch | Digital glitch effect | Tech/hacker aesthetic |
| Matrix Rain | Matrix-style falling characters | Fun, themed |
| Fade | Fade in/out cycle | Minimal distraction |
| Wave | Wavy text animation | Organic, flowing |
| Flip 3D | 3D rotation effect | Eye-catching |
| Vertical Scroll | Scrolling up/down | Alternative to horizontal |
| Diagonal Slide | Corner to corner movement | Dynamic |
| Circular Orbit | Rotating around edges | Unique, orbital |
| Color Sweep | Gradient color animation | Colorful, vibrant |

## Color Schemes

Category-based color coding for instant recognition:

| Category | Colors | Use Case |
|----------|--------|----------|
| Frontend | Orange/Red (warm) | React, Vue, Angular apps |
| Backend | Blue/Purple (cool) | APIs, services |
| Data/API | Green/Teal | Data pipelines, integrations |
| DevOps | Cyan/Gray | Infrastructure, CI/CD |
| Mobile | Pink/Magenta | iOS, Android, React Native |

Users can also define custom colors per project.

## What This Is NOT

- **Not a Peacock replacement** - Complementary, works alongside it
- **Not a project manager** - Integrates with Project Manager, doesn't reinvent it
- **Not required for basic VS Code use** - Pure enhancement for power users

## Success Metrics

The extension succeeds if users can:
1. Identify the correct VS Code window in < 1 second when Alt+Tab cycling
2. Configure their preferred style in < 2 minutes
3. Never accidentally work in the wrong window again

## Project Name

**RepoBeacon**

---

*This extension exists because subtle isn't enough for everyone.*

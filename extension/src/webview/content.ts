import { BeaconConfig } from './BeaconPanel';

// Color schemes matching the demo
const colorSchemes: Record<string, { primary: string; secondary: string; glow: string }> = {
  frontend: { primary: '#f97316', secondary: '#fb923c', glow: '249, 115, 22' },
  backend: { primary: '#3b82f6', secondary: '#60a5fa', glow: '59, 130, 246' },
  data: { primary: '#10b981', secondary: '#34d399', glow: '16, 185, 129' },
  devops: { primary: '#06b6d4', secondary: '#22d3ee', glow: '6, 182, 212' },
  mobile: { primary: '#ec4899', secondary: '#f472b6', glow: '236, 72, 153' },
};

function getColors(config: BeaconConfig): { primary: string; secondary: string; glow: string } {
  if (config.colorScheme === 'custom') {
    // Convert hex to RGB for glow, with validation
    const hex = config.customColor.replace('#', '');
    // Expand 3-char hex to 6-char (e.g., "fff" -> "ffffff")
    const fullHex = hex.length === 3 
      ? hex.split('').map(c => c + c).join('')
      : hex;
    
    // Validate and parse, fallback to blue if invalid
    if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
      return colorSchemes.backend; // Safe fallback
    }
    
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    return {
      primary: config.customColor,
      secondary: config.customColor,
      glow: `${r}, ${g}, ${b}`,
    };
  }
  
  // Default to backend colors for 'auto' 
  // TODO: Phase 2 - detect project type from package.json, requirements.txt, etc.
  return colorSchemes[config.colorScheme] || colorSchemes.backend;
}

function getPositionStyles(position: string): { position: string; entranceFrom: string; entranceTo: string } {
  switch (position) {
    case 'top-left':
      return {
        position: 'top: 20%; left: 20%; transform: translate(-50%, -50%);',
        entranceFrom: 'transform: translate(-50%, -50%) scale(0.8);',
        entranceTo: 'transform: translate(-50%, -50%) scale(1);',
      };
    case 'top-right':
      return {
        position: 'top: 20%; right: 20%; transform: translate(50%, -50%);',
        entranceFrom: 'transform: translate(50%, -50%) scale(0.8);',
        entranceTo: 'transform: translate(50%, -50%) scale(1);',
      };
    case 'bottom-left':
      return {
        position: 'bottom: 20%; left: 20%; transform: translate(-50%, 50%);',
        entranceFrom: 'transform: translate(-50%, 50%) scale(0.8);',
        entranceTo: 'transform: translate(-50%, 50%) scale(1);',
      };
    case 'bottom-right':
      return {
        position: 'bottom: 20%; right: 20%; transform: translate(50%, 50%);',
        entranceFrom: 'transform: translate(50%, 50%) scale(0.8);',
        entranceTo: 'transform: translate(50%, 50%) scale(1);',
      };
    case 'center':
    default:
      return {
        position: 'top: 50%; left: 50%; transform: translate(-50%, -50%);',
        entranceFrom: 'transform: translate(-50%, -50%) scale(0.8);',
        entranceTo: 'transform: translate(-50%, -50%) scale(1);',
      };
  }
}

function getAnimationStyles(style: string, colors: { primary: string; secondary: string; glow: string }): string {
  switch (style) {
    case 'shimmer':
      return `
        .beacon-text {
          position: relative;
          overflow: hidden;
        }
        .beacon-text::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `;
    case 'fade':
      return `
        .beacon-text {
          animation: fade 2s ease-in-out infinite;
        }
        @keyframes fade {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `;
    case 'pulse':
    default:
      return `
        .beacon-text {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 0.6;
            text-shadow: 0 0 20px rgba(${colors.glow}, 0.8), 0 0 40px rgba(${colors.glow}, 0.4);
          }
          50% { 
            transform: scale(1.1); 
            opacity: 1;
            text-shadow: 0 0 30px rgba(${colors.glow}, 1), 0 0 60px rgba(${colors.glow}, 0.6);
          }
        }
      `;
  }
}

export function getWebviewContent(repoName: string, config: BeaconConfig): string {
  const colors = getColors(config);
  const positionStyles = getPositionStyles(config.position);
  const animationStyles = getAnimationStyles(config.style, colors);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
  <title>RepoBeacon</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 100vw;
      height: 100vh;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow: hidden;
    }
    
    .beacon-container {
      position: fixed;
      ${positionStyles.position}
      z-index: 9999;
      pointer-events: none;
    }
    
    .beacon-text {
      font-size: ${config.fontSize};
      font-weight: 600;
      color: ${colors.secondary};
      text-shadow: 0 0 20px rgba(${colors.glow}, 0.8), 0 0 40px rgba(${colors.glow}, 0.4);
      padding: 1rem 2rem;
      background: rgba(30, 30, 30, 0.85);
      border-radius: 12px;
      border: 2px solid ${colors.primary}80;
      backdrop-filter: blur(8px);
      opacity: ${config.opacity};
    }
    
    ${animationStyles}
    
    /* Entrance animation */
    .beacon-container {
      animation: entrance 0.3s ease-out;
    }
    
    @keyframes entrance {
      from {
        opacity: 0;
        ${positionStyles.entranceFrom}
      }
      to {
        opacity: 1;
        ${positionStyles.entranceTo}
      }
    }
  </style>
</head>
<body>
  <div class="beacon-container">
    <div class="beacon-text">${escapeHtml(repoName)}</div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

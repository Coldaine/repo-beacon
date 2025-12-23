import React from 'react';
import { DVDBounce } from './animations/DVDBounce';
import { HorizontalScroll } from './animations/HorizontalScroll';
import { DiagonalSlide } from './animations/DiagonalSlide';
import { CircularOrbit } from './animations/CircularOrbit';
import { Typewriter } from './animations/Typewriter';
import { Pulse } from './animations/Pulse';
import { ColorSweep } from './animations/ColorSweep';
import { Fade } from './animations/Fade';
import { VerticalScroll } from './animations/VerticalScroll';
import { Glitch } from './animations/Glitch';
import { Wave } from './animations/Wave';
import { Flip3D } from './animations/Flip3D';
import { NeonPulse } from './animations/NeonPulse';
import { MatrixRain } from './animations/MatrixRain';
import { Shimmer } from './animations/Shimmer';
import { colorSchemes, ColorSchemeType } from '../types/ColorScheme';

interface VSCodeWindowProps {
  repoName: string;
  animationStyle: string;
  font: string;
  colorScheme: ColorSchemeType;
  repoType: string;
  isHighlighted?: boolean;
  isAnimating: boolean;
}

const sampleCode = `import React, { useState } from 'react';
import { Button } from './components/ui/button';

export default function App() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
  };
  
  return (
    <div className="container">
      <h1>Counter: {count}</h1>
      <Button onClick={handleClick}>
        Increment
      </Button>
    </div>
  );
}`;

export function VSCodeWindow({ repoName, animationStyle, font, colorScheme, repoType, isHighlighted, isAnimating }: VSCodeWindowProps) {
  const colors = colorSchemes[colorScheme];
  
  const renderAnimation = () => {
    const props = { repoName, font, colors, isAnimating };
    
    switch (animationStyle) {
      case 'dvd-bounce':
        return <DVDBounce {...props} />;
      case 'horizontal-scroll':
        return <HorizontalScroll {...props} />;
      case 'diagonal-slide':
        return <DiagonalSlide {...props} />;
      case 'circular-orbit':
        return <CircularOrbit {...props} />;
      case 'typewriter':
        return <Typewriter {...props} />;
      case 'pulse':
        return <Pulse {...props} />;
      case 'color-sweep':
        return <ColorSweep {...props} />;
      case 'fade':
        return <Fade {...props} />;
      case 'vertical-scroll':
        return <VerticalScroll {...props} />;
      case 'glitch':
        return <Glitch {...props} />;
      case 'wave':
        return <Wave {...props} />;
      case 'flip-3d':
        return <Flip3D {...props} />;
      case 'neon-pulse':
        return <NeonPulse {...props} />;
      case 'matrix-rain':
        return <MatrixRain {...props} />;
      case 'shimmer':
        return <Shimmer {...props} />;
      default:
        return <Pulse {...props} />;
    }
  };

  return (
    <div className={`bg-[#1e1e1e] rounded-lg overflow-hidden shadow-2xl border ${
      isHighlighted ? 'border-blue-400' : 'border-slate-700'
    }`}>
      {/* Title Bar */}
      <div className="bg-[#323233] px-4 py-2 flex items-center gap-2 border-b border-slate-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-slate-400 text-xs ml-2 truncate">App.tsx</div>
        <div 
          className="ml-auto px-2 py-0.5 rounded text-xs"
          style={{ 
            backgroundColor: `${colors.primary}20`,
            color: colors.categoryColor,
            border: `1px solid ${colors.primary}40`
          }}
        >
          {repoType}
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative h-64 overflow-hidden">
        {/* Code Background */}
        <div className="absolute inset-0 p-4">
          <pre className="text-sm text-slate-300" style={{ fontFamily: 'monospace' }}>
            <code>{sampleCode}</code>
          </pre>
        </div>

        {/* Repository Name Overlay */}
        {isAnimating && renderAnimation()}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1 flex items-center justify-between" style={{ backgroundColor: colors.primary }}>
        <div className="flex items-center gap-4">
          <span className="text-white text-xs">{repoName}</span>
          <span className="text-white/70 text-xs">{animationStyle}</span>
        </div>
        <div className="text-white/70 text-xs">{font}</div>
      </div>
    </div>
  );
}
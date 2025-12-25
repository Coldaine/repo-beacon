import React, { useEffect, useState } from 'react';
import { ColorScheme } from '../../types/ColorScheme';

interface TypewriterProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function Typewriter({ repoName, font, colors, isAnimating }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!isAnimating) {
      setDisplayText(repoName);
      setShowCursor(false);
      return;
    }
    
    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isAnimating, repoName]);

  useEffect(() => {
    if (!isAnimating) return;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && index < repoName.length) {
        setDisplayText(repoName.slice(0, index + 1));
        setIndex(index + 1);
      } else if (!isDeleting && index === repoName.length) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && index > 0) {
        setDisplayText(repoName.slice(0, index - 1));
        setIndex(index - 1);
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
      }
    }, isDeleting ? 50 : 120);

    return () => clearTimeout(timeout);
  }, [index, isDeleting, repoName, isAnimating]);

  return (
    <div className="absolute top-8 right-8 pointer-events-none">
      <div
        className="px-4 py-2 rounded-lg bg-slate-900/60 backdrop-blur-sm border"
        style={{
          fontFamily: font,
          fontSize: '1.1rem',
          color: colors.secondary,
          textShadow: `0 0 12px rgba(${colors.glowRgba}, 0.7)`,
          opacity: 0.85,
          borderColor: `${colors.border}40`,
        }}
      >
        {displayText}
        <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
      </div>
    </div>
  );
}
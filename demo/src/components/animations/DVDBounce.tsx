import React, { useEffect, useState } from 'react';
import { ColorScheme } from '../../types/ColorScheme';

interface DVDBounceProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function DVDBounce({ repoName, font, colors, isAnimating }: DVDBounceProps) {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [velocity, setVelocity] = useState({ x: 1.2, y: 0.8 });
  const [currentColor, setCurrentColor] = useState(colors.primary);

  const colorVariants = [colors.primary, colors.secondary, colors.accent];
  const width = 15; // approximate width percentage
  const height = 10; // approximate height percentage

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;
        let colorChanged = false;

        // Bounce off edges
        if (newX <= 0 || newX >= (100 - width)) {
          newVelX = -velocity.x;
          newX = newX <= 0 ? 0 : (100 - width);
          colorChanged = true;
        }
        if (newY <= 0 || newY >= (100 - height)) {
          newVelY = -velocity.y;
          newY = newY <= 0 ? 0 : (100 - height);
          colorChanged = true;
        }

        if (colorChanged) {
          setCurrentColor(colorVariants[Math.floor(Math.random() * colorVariants.length)]);
        }

        setVelocity({ x: newVelX, y: newVelY });

        return {
          x: Math.max(0, Math.min(100 - width, newX)),
          y: Math.max(0, Math.min(100 - height, newY)),
        };
      });
    }, 30);

    return () => clearInterval(interval);
  }, [velocity, isAnimating]);

  return (
    <div
      className="absolute pointer-events-none transition-all duration-100 ease-linear"
      style={{
        left: isAnimating ? `${position.x}%` : '10%',
        top: isAnimating ? `${position.y}%` : '10%',
        fontFamily: font,
        color: currentColor,
        textShadow: `0 0 15px ${currentColor}, 0 0 25px ${currentColor}`,
        opacity: 0.85,
      }}
    >
      <div className="whitespace-nowrap px-3 py-1.5 rounded-md bg-slate-900/40 backdrop-blur-sm border-2" style={{ borderColor: currentColor }}>
        {repoName}
      </div>
    </div>
  );
}
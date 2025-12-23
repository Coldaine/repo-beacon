import React from 'react';
import { motion } from 'motion/react';

interface ColorScheme {
  accent: string;
  glowRgba: string;
}

interface MatrixRainProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function MatrixRain({ repoName, font, colors, isAnimating }: MatrixRainProps) {
  const chars = repoName.split('');

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary rain stream */}
      <div className="flex justify-center items-start pt-4 gap-1">
        {chars.map((char, index) => (
          <motion.div
            key={`main-${index}`}
            className="px-0.5"
            style={{
              fontFamily: font,
              fontSize: '1.2rem',
              color: colors.accent,
              textShadow: `0 0 10px rgba(${colors.glowRgba}, 0.6)`,
            }}
            animate={isAnimating ? {
              y: [-100, 300],
              opacity: [0, 1, 1, 0.5, 0],
            } : {
              y: 50,
              opacity: 0.8,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.15,
              ease: 'linear',
            }}
          >
            {char}
          </motion.div>
        ))}
      </div>
      
      {/* Secondary rain stream */}
      <div className="flex justify-center items-start pt-4 gap-1">
        {chars.map((char, index) => (
          <motion.div
            key={`second-${index}`}
            className="px-0.5"
            style={{
              fontFamily: font,
              fontSize: '1.2rem',
              color: '#22c55e',
              textShadow: '0 0 12px rgba(34, 197, 94, 0.8)',
            }}
            animate={isAnimating ? {
              y: [-100, 300],
              opacity: [0, 0.7, 0.7, 0.3, 0],
            } : {
              y: 100,
              opacity: 0.5,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.15 + 1.5,
              ease: 'linear',
            }}
          >
            {char}
          </motion.div>
        ))}
      </div>

      {/* Tertiary rain stream */}
      <div className="flex justify-center items-start pt-4 gap-1">
        {chars.map((char, index) => (
          <motion.div
            key={`third-${index}`}
            className="px-0.5"
            style={{
              fontFamily: font,
              fontSize: '1.2rem',
              color: '#16a34a',
              textShadow: '0 0 10px rgba(22, 163, 74, 0.6)',
            }}
            animate={isAnimating ? {
              y: [-100, 300],
              opacity: [0, 0.5, 0.5, 0.2, 0],
            } : {
              y: 150,
              opacity: 0.3,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.15 + 0.75,
              ease: 'linear',
            }}
          >
            {char}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
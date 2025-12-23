import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface GlitchProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function Glitch({ repoName, font, colors, isAnimating }: GlitchProps) {
  return (
    <div className="absolute top-1/3 left-1/4 pointer-events-none">
      <div className="relative">
        {/* Main text */}
        <motion.div
          className="px-4 py-2 rounded-lg bg-slate-900/40 backdrop-blur-sm relative z-10"
          style={{
            fontFamily: font,
            fontSize: '1.1rem',
            color: colors.secondary,
            textShadow: `0 0 8px rgba(${colors.glowRgba}, 0.8)`,
            opacity: 0.85,
          }}
          animate={isAnimating ? {
            x: [0, -3, 3, -2, 2, 0],
          } : {}}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        >
          {repoName}
        </motion.div>
        
        {/* Red glitch layer */}
        <motion.div
          className="absolute top-0 left-0 px-4 py-2 rounded-lg"
          style={{
            fontFamily: font,
            fontSize: '1.1rem',
            color: '#ff0000',
            mixBlendMode: 'screen',
          }}
          animate={isAnimating ? {
            opacity: [0, 0.9, 0, 0.7, 0],
            x: [0, -5, -3, -4, 0],
            y: [0, 1, -1, 2, 0],
          } : {
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        >
          {repoName}
        </motion.div>
        
        {/* Cyan glitch layer */}
        <motion.div
          className="absolute top-0 left-0 px-4 py-2 rounded-lg"
          style={{
            fontFamily: font,
            fontSize: '1.1rem',
            color: '#00ffff',
            mixBlendMode: 'screen',
          }}
          animate={isAnimating ? {
            opacity: [0, 0.8, 0, 0.9, 0],
            x: [0, 5, 3, 4, 0],
            y: [0, -1, 1, -2, 0],
          } : {
            opacity: 0,
          }}
          transition={{
            duration: 0.4,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        >
          {repoName}
        </motion.div>
      </div>
    </div>
  );
}
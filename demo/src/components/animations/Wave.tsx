import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface WaveProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function Wave({ repoName, font, colors, isAnimating }: WaveProps) {
  return (
    <div className="absolute bottom-1/4 left-8 pointer-events-none">
      <motion.div
        className="px-4 py-2 rounded-lg bg-slate-900/40 backdrop-blur-sm border"
        style={{
          fontFamily: font,
          fontSize: '1.1rem',
          color: colors.secondary,
          textShadow: `0 0 15px rgba(${colors.glowRgba}, 0.8), 0 0 25px rgba(${colors.glowRgba}, 0.4)`,
          opacity: 0.8,
          borderColor: `${colors.border}40`,
        }}
        animate={isAnimating ? {
          x: [0, 30, 0, -30, 0],
          y: [0, -15, 0, -15, 0],
          rotate: [0, 5, 0, -5, 0],
        } : {
          x: 0,
          y: 0,
          rotate: 0,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {repoName}
      </motion.div>
    </div>
  );
}
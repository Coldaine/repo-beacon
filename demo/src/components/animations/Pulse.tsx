import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface PulseProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function Pulse({ repoName, font, colors, isAnimating }: PulseProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="px-5 py-3 rounded-xl bg-slate-900/40 backdrop-blur-sm border-2"
        style={{
          fontFamily: font,
          fontSize: '1.2rem',
          color: colors.secondary,
          borderColor: `${colors.primary}50`,
          textShadow: `0 0 20px rgba(${colors.glowRgba}, 1), 0 0 35px rgba(${colors.glowRgba}, 0.6)`,
        }}
        animate={isAnimating ? {
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        } : {
          scale: 1,
          opacity: 0.7,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {repoName}
      </motion.div>
    </div>
  );
}
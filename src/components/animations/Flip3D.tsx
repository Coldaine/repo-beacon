import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface Flip3DProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function Flip3D({ repoName, font, colors, isAnimating }: Flip3DProps) {
  return (
    <div className="absolute top-1/4 right-1/4 pointer-events-none" style={{ perspective: '1000px' }}>
      <motion.div
        className="px-5 py-2 rounded-lg bg-slate-900/50 backdrop-blur-sm border"
        style={{
          fontFamily: font,
          fontSize: '1.1rem',
          color: colors.secondary,
          textShadow: `0 0 15px rgba(${colors.glowRgba}, 0.8), 0 0 25px rgba(${colors.glowRgba}, 0.4)`,
          transformStyle: 'preserve-3d',
          borderColor: `${colors.border}40`,
        }}
        animate={isAnimating ? {
          rotateY: [0, 360],
          opacity: [0.7, 1, 0.7],
        } : {
          rotateY: 0,
          opacity: 0.8,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {repoName}
      </motion.div>
    </div>
  );
}
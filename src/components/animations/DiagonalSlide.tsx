import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface DiagonalSlideProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function DiagonalSlide({ repoName, font, colors, isAnimating }: DiagonalSlideProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute"
        style={{
          fontFamily: font,
          fontSize: '1.1rem',
          color: colors.secondary,
          textShadow: `0 0 15px rgba(${colors.glowRgba}, 0.8), 0 0 25px rgba(${colors.glowRgba}, 0.4)`,
          opacity: 0.8,
        }}
        animate={isAnimating ? {
          x: [-150, 450],
          y: [-80, 350],
        } : {
          x: 50,
          y: 50,
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="px-4 py-2 rounded-lg bg-slate-900/50 backdrop-blur-sm border" style={{ borderColor: `${colors.border}30` }}>
          {repoName}
        </div>
      </motion.div>
    </div>
  );
}
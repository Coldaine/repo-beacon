import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface ColorSweepProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function ColorSweep({ repoName, font, colors, isAnimating }: ColorSweepProps) {
  return (
    <div className="absolute bottom-8 left-8 pointer-events-none">
      <motion.div
        className="px-4 py-2 rounded-lg bg-slate-900/30 backdrop-blur-sm"
        style={{
          fontFamily: font,
          fontSize: '1.2rem',
        }}
      >
        <motion.span
          style={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #ef4444, #f59e0b, #10b981, #06b6d4, #3b82f6)',
            backgroundSize: '300% 100%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}
          animate={isAnimating ? {
            backgroundPosition: ['0% 50%', '300% 50%'],
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {repoName}
        </motion.span>
      </motion.div>
    </div>
  );
}
import React from 'react';
import { motion } from 'motion/react';

interface ColorScheme {
  secondary: string;
  glowRgba: string;
}

interface VerticalScrollProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function VerticalScroll({ repoName, font, colors, isAnimating }: VerticalScrollProps) {
  return (
    <div className="absolute right-8 top-0 bottom-0 overflow-hidden pointer-events-none flex items-center">
      <motion.div
        className="flex flex-col"
        style={{
          fontFamily: font,
          fontSize: '1.1rem',
          color: colors.secondary,
          textShadow: `0 0 12px rgba(${colors.glowRgba}, 0.8), 0 0 20px rgba(${colors.glowRgba}, 0.4)`,
          opacity: 0.8,
        }}
        animate={isAnimating ? {
          y: ['0%', '-50%'],
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div key={i} className="py-4 px-2 whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
            {repoName}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
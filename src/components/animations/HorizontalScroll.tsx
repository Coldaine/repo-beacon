import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface HorizontalScrollProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function HorizontalScroll({ repoName, font, colors, isAnimating }: HorizontalScrollProps) {
  return (
    <div className="absolute top-6 left-0 right-0 overflow-hidden pointer-events-none">
      <motion.div
        className="whitespace-nowrap flex"
        animate={isAnimating ? {
          x: ['0%', '-50%'],
        } : {}}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="px-6 py-1.5 inline-block"
            style={{
              fontFamily: font,
              fontSize: '1.1rem',
              color: colors.secondary,
              textShadow: `0 0 12px rgba(${colors.glowRgba}, 0.8), 0 0 20px rgba(${colors.glowRgba}, 0.4)`,
              opacity: 0.75,
            }}
          >
            {repoName}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
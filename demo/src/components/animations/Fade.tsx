import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface FadeProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function Fade({ repoName, font, colors, isAnimating }: FadeProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <motion.div
        className="px-5 py-3 rounded-xl bg-slate-900/30 backdrop-blur-sm border"
        style={{
          fontFamily: font,
          fontSize: '1.2rem',
          color: colors.secondary,
          borderColor: `${colors.border}40`,
        }}
        animate={isAnimating ? {
          opacity: [0.3, 1, 0.3],
          textShadow: [
            `0 0 10px rgba(${colors.glowRgba}, 0.4)`,
            `0 0 25px rgba(${colors.glowRgba}, 1), 0 0 40px rgba(${colors.glowRgba}, 0.6)`,
            `0 0 10px rgba(${colors.glowRgba}, 0.4)`,
          ],
        } : {
          opacity: 0.7,
          textShadow: `0 0 15px rgba(${colors.glowRgba}, 0.6)`,
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {repoName}
      </motion.div>
    </div>
  );
}
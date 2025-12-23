import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface NeonPulseProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function NeonPulse({ repoName, font, colors, isAnimating }: NeonPulseProps) {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none">
      <motion.div
        className="px-5 py-2 rounded-lg border-2"
        style={{
          fontFamily: font,
          fontSize: '1.1rem',
          color: colors.secondary,
          borderColor: colors.primary,
          fontWeight: 600,
        }}
        animate={isAnimating ? {
          textShadow: [
            `0 0 10px rgba(${colors.glowRgba}, 0.5)`,
            `0 0 25px rgba(${colors.glowRgba}, 1), 0 0 35px rgba(${colors.glowRgba}, 0.8), 0 0 45px rgba(${colors.glowRgba}, 0.6)`,
            `0 0 10px rgba(${colors.glowRgba}, 0.5)`,
          ],
          boxShadow: [
            `0 0 10px rgba(${colors.glowRgba}, 0.3), inset 0 0 10px rgba(${colors.glowRgba}, 0.1)`,
            `0 0 30px rgba(${colors.glowRgba}, 0.8), 0 0 50px rgba(${colors.glowRgba}, 0.5), inset 0 0 20px rgba(${colors.glowRgba}, 0.3)`,
            `0 0 10px rgba(${colors.glowRgba}, 0.3), inset 0 0 10px rgba(${colors.glowRgba}, 0.1)`,
          ],
          borderColor: [colors.primary, colors.accent, colors.secondary, colors.accent, colors.primary],
          opacity: [0.8, 1, 0.8],
        } : {
          textShadow: `0 0 15px rgba(${colors.glowRgba}, 0.6)`,
          boxShadow: `0 0 15px rgba(${colors.glowRgba}, 0.4), inset 0 0 10px rgba(${colors.glowRgba}, 0.2)`,
          opacity: 0.85,
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {repoName}
      </motion.div>
    </div>
  );
}
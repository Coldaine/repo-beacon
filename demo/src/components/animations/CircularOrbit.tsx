import React from 'react';
import { motion } from 'motion/react';
import { ColorScheme } from '../../types/ColorScheme';

interface CircularOrbitProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function CircularOrbit({ repoName, font, colors, isAnimating }: CircularOrbitProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="relative"
        style={{ width: 0, height: 0 }}
        animate={isAnimating ? {
          rotate: 360,
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <motion.div
          className="absolute whitespace-nowrap px-4 py-2 rounded-lg bg-slate-900/50 backdrop-blur-sm border"
          style={{
            fontFamily: font,
            fontSize: '1.1rem',
            color: colors.secondary,
            textShadow: `0 0 15px rgba(${colors.glowRgba}, 0.9), 0 0 25px rgba(${colors.glowRgba}, 0.5)`,
            opacity: 0.85,
            borderColor: `${colors.border}30`,
            left: '-50%',
            top: '-100px',
          }}
          animate={isAnimating ? {
            rotate: -360,
          } : {}}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {repoName}
        </motion.div>
      </motion.div>
    </div>
  );
}
import React from 'react';
import { motion } from 'motion/react';

interface ColorScheme {
  border: string;
  secondary: string;
  glowRgba: string;
}

interface ShimmerProps {
  repoName: string;
  font: string;
  colors: ColorScheme;
  isAnimating: boolean;
}

export function Shimmer({ repoName, font, colors, isAnimating }: ShimmerProps) {
  return (
    <div className="absolute bottom-8 right-8 pointer-events-none">
      <div className="relative overflow-hidden px-5 py-2 rounded-lg bg-slate-900/40 backdrop-blur-sm border" style={{ borderColor: `${colors.border}40` }}>
        <motion.div
          style={{
            fontFamily: font,
            fontSize: '1.1rem',
            color: colors.secondary,
            textShadow: `0 0 15px rgba(${colors.glowRgba}, 0.8), 0 0 25px rgba(${colors.glowRgba}, 0.4)`,
            opacity: 0.85,
            fontWeight: 600,
          }}
        >
          {repoName}
        </motion.div>
        
        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)',
            width: '50%',
          }}
          animate={isAnimating ? {
            x: ['-100%', '300%'],
          } : {
            x: '-100%',
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 0.5,
          }}
        />
      </div>
    </div>
  );
}
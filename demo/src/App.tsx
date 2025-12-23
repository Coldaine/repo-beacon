import React, { useState } from 'react';
import { VSCodeWindow } from './components/VSCodeWindow';
import { Monitor, Palette, Play, Pause } from 'lucide-react';
import { ColorSchemeType } from './types/ColorScheme';

const repoExamples = [
  { id: 1, name: 'frontend-dashboard', style: 'dvd-bounce', font: 'Fira Code', colorScheme: 'frontend' as ColorSchemeType, type: 'Frontend' },
  { id: 2, name: 'api-gateway', style: 'horizontal-scroll', font: 'JetBrains Mono', colorScheme: 'backend' as ColorSchemeType, type: 'Backend' },
  { id: 3, name: 'user-service', style: 'diagonal-slide', font: 'Cascadia Code', colorScheme: 'backend_alt' as ColorSchemeType, type: 'Backend' },
  { id: 4, name: 'data-pipeline', style: 'circular-orbit', font: 'Source Code Pro', colorScheme: 'data' as ColorSchemeType, type: 'Data/API' },
  { id: 5, name: 'auth-service', style: 'typewriter', font: 'Hack', colorScheme: 'backend' as ColorSchemeType, type: 'Backend' },
  { id: 6, name: 'payment-processor', style: 'pulse', font: 'Fira Code', colorScheme: 'frontend_alt' as ColorSchemeType, type: 'Frontend' },
  { id: 7, name: 'notification-hub', style: 'color-sweep', font: 'JetBrains Mono', colorScheme: 'data_alt' as ColorSchemeType, type: 'Data/API' },
  { id: 8, name: 'analytics-engine', style: 'fade', font: 'Cascadia Code', colorScheme: 'data' as ColorSchemeType, type: 'Data/API' },
  { id: 9, name: 'cache-manager', style: 'vertical-scroll', font: 'Source Code Pro', colorScheme: 'devops' as ColorSchemeType, type: 'DevOps' },
  { id: 10, name: 'websocket-server', style: 'glitch', font: 'Hack', colorScheme: 'backend_alt' as ColorSchemeType, type: 'Backend' },
  { id: 11, name: 'queue-worker', style: 'wave', font: 'Fira Code', colorScheme: 'devops' as ColorSchemeType, type: 'DevOps' },
  { id: 12, name: 'database-migrator', style: 'flip-3d', font: 'JetBrains Mono', colorScheme: 'data_alt' as ColorSchemeType, type: 'Data/API' },
  { id: 13, name: 'cdn-optimizer', style: 'neon-pulse', font: 'Cascadia Code', colorScheme: 'devops_alt' as ColorSchemeType, type: 'DevOps' },
  { id: 14, name: 'ml-trainer', style: 'matrix-rain', font: 'Source Code Pro', colorScheme: 'data' as ColorSchemeType, type: 'Data/API' },
  { id: 15, name: 'mobile-app-ui', style: 'shimmer', font: 'Hack', colorScheme: 'mobile' as ColorSchemeType, type: 'Mobile' },
];

export default function App() {
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Monitor className="w-10 h-10 text-blue-400" />
            <h1 className="text-white">VS Code Repository Window Identifier</h1>
          </div>
          <p className="text-slate-300 max-w-2xl mx-auto">
            A comprehensive demonstration of 15 unique visual styles for identifying different repository windows.
            Each animation is designed to be eye-catching yet non-obtrusive, using semi-transparent overlays.
          </p>
          
          {/* Animation Toggle */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all ${
                isAnimating
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {isAnimating ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Animations</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Play Animations</span>
                </>
              )}
            </button>
            <div className="text-slate-400 text-sm">
              {isAnimating ? 'All animations are active' : 'Showing static preview'}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Animation Styles */}
            <div>
              <h2 className="text-white mb-4">Animation Styles</h2>
              <div className="grid grid-cols-2 gap-2">
                {repoExamples.map((example) => (
                  <div
                    key={example.id}
                    className="bg-slate-700/50 rounded px-3 py-2 text-slate-300 cursor-pointer hover:bg-slate-600/50 transition-colors text-sm"
                    onClick={() => setSelectedExample(selectedExample === example.id ? null : example.id)}
                  >
                    <div className="text-xs text-slate-400 truncate">{example.style}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Schemes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-blue-400" />
                <h2 className="text-white">Repository Color Schemes</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded" style={{ background: '#f97316' }}></div>
                    <div className="w-6 h-6 rounded" style={{ background: '#ef4444' }}></div>
                  </div>
                  <span className="text-slate-300 text-sm">Frontend - Warm tones (Red/Orange)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded" style={{ background: '#3b82f6' }}></div>
                    <div className="w-6 h-6 rounded" style={{ background: '#8b5cf6' }}></div>
                  </div>
                  <span className="text-slate-300 text-sm">Backend - Cool tones (Blue/Purple)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded" style={{ background: '#10b981' }}></div>
                    <div className="w-6 h-6 rounded" style={{ background: '#14b8a6' }}></div>
                  </div>
                  <span className="text-slate-300 text-sm">Data/API - Green spectrum (Emerald/Teal)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded" style={{ background: '#06b6d4' }}></div>
                    <div className="w-6 h-6 rounded" style={{ background: '#64748b' }}></div>
                  </div>
                  <span className="text-slate-300 text-sm">DevOps - Cyan/Gray tones</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded" style={{ background: '#ec4899' }}></div>
                  </div>
                  <span className="text-slate-300 text-sm">Mobile - Pink/Magenta</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid of VS Code Windows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {repoExamples.map((example) => (
            <div
              key={example.id}
              className={`transform transition-all duration-300 ${
                selectedExample === example.id ? 'scale-105 ring-2 ring-blue-400 rounded-lg' : ''
              }`}
            >
              <VSCodeWindow
                repoName={example.name}
                animationStyle={example.style}
                font={example.font}
                colorScheme={example.colorScheme}
                repoType={example.type}
                isHighlighted={selectedExample === example.id}
                isAnimating={isAnimating}
              />
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Click on animation styles above to highlight specific examples</p>
          <p className="mt-2">All overlays are semi-transparent and positioned to avoid blocking code</p>
        </div>
      </div>
    </div>
  );
}
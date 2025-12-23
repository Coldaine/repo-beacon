export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  glowRgba: string;
  border: string;
  category: string;
  categoryColor: string;
}

export const colorSchemes: Record<string, ColorScheme> = {
  frontend: {
    primary: '#f97316',      // Orange
    secondary: '#fb923c',    // Light orange
    accent: '#ea580c',       // Dark orange
    glow: '#f97316',
    glowRgba: '249, 115, 22',
    border: '#fdba74',
    category: 'Frontend',
    categoryColor: '#fed7aa',
  },
  frontend_alt: {
    primary: '#ef4444',      // Red
    secondary: '#f87171',    // Light red
    accent: '#dc2626',       // Dark red
    glow: '#ef4444',
    glowRgba: '239, 68, 68',
    border: '#fca5a5',
    category: 'Frontend',
    categoryColor: '#fed7aa',
  },
  backend: {
    primary: '#3b82f6',      // Blue
    secondary: '#60a5fa',    // Light blue
    accent: '#2563eb',       // Dark blue
    glow: '#3b82f6',
    glowRgba: '59, 130, 246',
    border: '#93c5fd',
    category: 'Backend',
    categoryColor: '#dbeafe',
  },
  backend_alt: {
    primary: '#8b5cf6',      // Purple
    secondary: '#a78bfa',    // Light purple
    accent: '#7c3aed',       // Dark purple
    glow: '#8b5cf6',
    glowRgba: '139, 92, 246',
    border: '#c4b5fd',
    category: 'Backend',
    categoryColor: '#dbeafe',
  },
  data: {
    primary: '#10b981',      // Emerald
    secondary: '#34d399',    // Light emerald
    accent: '#059669',       // Dark emerald
    glow: '#10b981',
    glowRgba: '16, 185, 129',
    border: '#6ee7b7',
    category: 'Data/API',
    categoryColor: '#d1fae5',
  },
  data_alt: {
    primary: '#14b8a6',      // Teal
    secondary: '#2dd4bf',    // Light teal
    accent: '#0d9488',       // Dark teal
    glow: '#14b8a6',
    glowRgba: '20, 184, 166',
    border: '#5eead4',
    category: 'Data/API',
    categoryColor: '#d1fae5',
  },
  devops: {
    primary: '#06b6d4',      // Cyan
    secondary: '#22d3ee',    // Light cyan
    accent: '#0891b2',       // Dark cyan
    glow: '#06b6d4',
    glowRgba: '6, 182, 212',
    border: '#67e8f9',
    category: 'DevOps',
    categoryColor: '#cffafe',
  },
  devops_alt: {
    primary: '#64748b',      // Slate
    secondary: '#94a3b8',    // Light slate
    accent: '#475569',       // Dark slate
    glow: '#64748b',
    glowRgba: '100, 116, 139',
    border: '#cbd5e1',
    category: 'DevOps',
    categoryColor: '#e2e8f0',
  },
  mobile: {
    primary: '#ec4899',      // Pink
    secondary: '#f472b6',    // Light pink
    accent: '#db2777',       // Dark pink
    glow: '#ec4899',
    glowRgba: '236, 72, 153',
    border: '#f9a8d4',
    category: 'Mobile',
    categoryColor: '#fce7f3',
  },
  testing: {
    primary: '#eab308',      // Yellow
    secondary: '#facc15',    // Light yellow
    accent: '#ca8a04',       // Dark yellow
    glow: '#eab308',
    glowRgba: '234, 179, 8',
    border: '#fde047',
    category: 'Testing/QA',
    categoryColor: '#fef9c3',
  },
};

export type ColorSchemeType = keyof typeof colorSchemes;

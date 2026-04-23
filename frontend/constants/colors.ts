// Colors theme — updated with premium and gradient colors
export const COLORS = {
  // Primary colors - Rich TopCV Green (matching the design)
  primary: '#1AB14F',           // Updated to richer green
  primaryLight: '#D4F0E0',      // Updated light green
  primaryDark: '#008A3C',

  // Secondary colors
  secondary: '#1A73E8',
  secondaryLight: '#E8F0FE',
  secondaryDark: '#1557B0',

  // Premium colors
  gold: '#F59E0B',
  goldLight: '#FEF3C7',
  goldDark: '#D97706',

  // Neutrals - Moving away from pure black, using warm/cool grays
  white: '#FFFFFF',
  black: '#1A1A1A',             // Softer black
  gray: {
    50: '#FBFBFC',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Text colors - Optimized for readability and elegance
  text: {
    primary: '#1A1A1A',         // Refined black
    secondary: '#4B5563',       // Gray 600
    light: '#9CA3AF',           // Gray 400
    white: '#FFFFFF',
    disabled: '#D1D5DB',
    link: '#1AB14F',            // Updated to match primary
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FBFBFC',       // Subtle off-white
    tertiary: '#F3F4F6',
    dark: '#111827',
  },

  // UI Elements
  border: '#EEEEEE',            // Very subtle borders
  divider: '#F3F4F6',
  input: '#FBFBFC',
  
  // Shadows
  shadow: 'rgba(0, 0, 0, 0.04)',
  shadowMedium: 'rgba(0, 0, 0, 0.08)',
};

export type ColorVariant = keyof typeof COLORS;

export default COLORS;
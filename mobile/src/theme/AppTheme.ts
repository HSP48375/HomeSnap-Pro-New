
// AppTheme.ts - Shared styling constants to match web application
export const colors = {
  // Core colors
  background: '#000000',
  foreground: '#FFFFFF',
  
  // Accent colors
  primary: '#00EEFF',
  secondary: '#FF3DFF',
  tertiary: '#9D00FF',
  
  // UI colors
  cardBackground: 'rgba(10, 10, 30, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.05)',
  inputBackground: 'rgba(20, 20, 40, 0.6)',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
};

export const gradients = {
  primary: ['#00EEFF', '#FF3DFF', '#9D00FF'],
  accent: ['#FF00C1', '#00EEFF'],
  button: ['#9D00FF', '#FF00C1'],
  card: ['rgba(10, 10, 20, 0.5)', 'rgba(20, 20, 40, 0.5)'],
};

export const shadows = {
  small: '0px 2px 8px rgba(0, 0, 0, 0.3)',
  medium: '0px 4px 20px rgba(0, 0, 0, 0.3)',
  large: '0px 10px 30px rgba(0, 0, 0, 0.4)',
  glow: '0px 0px 20px rgba(0, 238, 255, 0.3)',
  neon: '0px 0px 15px rgba(255, 0, 193, 0.5)',
};

export const fonts = {
  primary: 'Outfit',
  secondary: 'Poppins',
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const glassmorphism = {
  backgroundBlack: 'rgba(10, 10, 20, 0.7)',
  backgroundLight: 'rgba(20, 20, 40, 0.6)',
  border: 'rgba(255, 255, 255, 0.05)',
  blur: 12,
};

// Shared component styling
export const buttonStyles = {
  primary: {
    background: 'linear-gradient(135deg, #9D00FF, #FF00C1)',
    color: '#FFFFFF',
    shadow: '0px 0px 15px rgba(255, 0, 193, 0.3)',
  },
  secondary: {
    background: 'rgba(20, 20, 40, 0.7)',
    color: '#00EEFF',
    border: '1px solid rgba(0, 238, 255, 0.3)',
  },
  outline: {
    background: 'transparent',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
};

export const cardStyles = {
  standard: {
    background: 'rgba(10, 10, 20, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    shadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
  },
  interactive: {
    background: 'rgba(20, 20, 40, 0.6)',
    border: '1px solid rgba(0, 238, 255, 0.2)',
    borderRadius: 16,
    shadow: '0px 0px 20px rgba(0, 238, 255, 0.2)',
  },
};

export const inputStyles = {
  standard: {
    background: 'rgba(20, 20, 40, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    placeholder: 'rgba(255, 255, 255, 0.5)',
  },
  focused: {
    border: '1px solid rgba(0, 238, 255, 0.5)',
    shadow: '0px 0px 10px rgba(0, 238, 255, 0.2)',
  },
};

// Helper function to create linear gradients for React Native
export const createLinearGradient = (colors: string[], start = { x: 0, y: 0 }, end = { x: 1, y: 1 }) => {
  return { colors, start, end };
};

import { MD3DarkTheme } from 'react-native-paper';

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary colors
    primary: '#64B5F6',
    primaryContainer: '#1565C0',
    onPrimary: '#000000',
    onPrimaryContainer: '#E3F2FD',
    
    // Surface and background
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    background: '#121212',
    
    // Text colors
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#B0B0B0',
    onBackground: '#FFFFFF',
    
    // Secondary colors
    secondary: '#4DD0E1',
    secondaryContainer: '#00838F',
    onSecondary: '#000000',
    onSecondaryContainer: '#B2EBF2',
    
    // Error colors
    error: '#EF5350',
    errorContainer: '#C62828',
    onError: '#000000',
    onErrorContainer: '#FFCDD2',
    
    tertiary: '#FFD54F',
    tertiaryContainer: '#F57C00',
    onTertiary: '#000000',
    onTertiaryContainer: '#FFE082',
    
    // Borders and outlines
    outline: '#616161',
    outlineVariant: '#424242',
    
    // Inverse colors
    inverseSurface: '#E0E0E0',
    inverseOnSurface: '#121212',
    inversePrimary: '#1976D2',
    
    // Shadows and overlays
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.7)',
    
    // Elevation levels
    elevation: {
      level0: 'transparent',
      level1: '#1E1E1E',
      level2: '#232323',
      level3: '#282828',
      level4: '#2C2C2C',
      level5: '#2E2E2E',
    },
  },
  dark: true,
};

import { config } from '@tamagui/config/v3'
import { createFont, createTamagui, StaticConfig, createTheme } from 'tamagui'

// Define base colors for light and dark modes
const lightTheme = {
  background: '#FFFFFF',
  foreground: '#000000',
  card: '#F9F9F9',
  border: '#E0E0E0',
  text: '#333333',
  muted: '#666666',
}

const darkTheme = {
  background: '#121212',
  foreground: '#FFFFFF',
  card: '#1E1E1E',
  border: '#2C2C2C',
  text: '#F0F0F0',
  muted: '#A0A0A0',
}

// Define accent colors
const accentColors = {
  orange: {
    accent: '#FF6B00',
    accentLight: '#FFB27F',
    accentDark: '#CC5500',
  },
  blue: {
    accent: '#0088FF',
    accentLight: '#7FC1FF',
    accentDark: '#0066CC',
  },
  green: {
    accent: '#00CC88',
    accentLight: '#7FEAC0',
    accentDark: '#00A36C',
  },
  purple: {
    accent: '#8855FF',
    accentLight: '#C0A7FF',
    accentDark: '#6C44CC',
  },
}

// Create themes by combining base themes with accent colors
const themes: Record<string, ReturnType<typeof createTheme>> = {}

// Generate light themes with different accent colors
Object.entries(accentColors).forEach(([name, colors]) => {
  themes[`light_${name}`] = createTheme({
    ...lightTheme,
    ...colors,
  })
  
  themes[`dark_${name}`] = createTheme({
    ...darkTheme,
    ...colors,
  })
})

const tamaguiConfig = createTamagui({
  ...(config as StaticConfig),
  fonts: {
    body: createFont({
      family: 'Gilroy-Regular',
      size: {
        '1': 11,
        '2': 12,
        '3': 13,
        '4': 14,
        '5': 13,
        '6': 15,
        '7': 20,
        '8': 23,
        '9': 32,
        '10': 44,
        '11': 55,
        '12': 62,
        '13': 72,
        '14': 92,
        '15': 114,
        '16': 134,
        true: 14,
      },
      weight: {
        '1': '400',
        '2': '400',
        '3': '400',
        '4': '400',
        '5': '400',
        '6': '400',
        '7': '700',
        '8': '700',
        '9': '700',
        '10': '700',
        '11': '700',
        '12': '700',
        '13': '700',
        '14': '700',
        '15': '700',
        '16': '700',
        true: '700',
      },
    }),
  },
  themes: {
    ...config.themes,
    ...themes,
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig

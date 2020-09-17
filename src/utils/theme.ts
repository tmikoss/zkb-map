export const theme = {
  background: '#060606',
  colorMaxSec: '#cfcfcf',
  colorMinSec: '#a1a1a1',
  flare: '#E60000',
  text: '#E6E6E6',
  unit: 32,
  gapSize: 8,
  regionFontSize: 8
}

export type Theme = typeof theme

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

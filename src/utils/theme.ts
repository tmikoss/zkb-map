export const theme = {
  background: '#060606',
  colorMaxSec: '#2A9FD6',
  colorMinSec: '#E6E6E6',
  flare: '#E60000',
  text: '#E6E6E6',
  unit: 32,
  gapSize: 8
}

export type Theme = typeof theme

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

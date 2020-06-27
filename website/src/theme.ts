import type { DefaultTheme } from 'styled-components'

export const theme: Required<DefaultTheme> = {
  background: '#d1d8dc',
  maxWidth: '1080px',
  borderRadius: '8px',

  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, Icons16, sans-serif',
  },
} as const

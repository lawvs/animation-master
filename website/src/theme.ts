import type { DefaultTheme } from 'styled-components'

export const theme: Required<DefaultTheme> = {
  background: '#f7f9fb',
  maxWidth: '1080px',
  borderRadius: '16px',

  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, Icons16, sans-serif',
  },
} as const

// See https://styled-components.com/docs/api#create-a-declarations-file
// import original module declarations
import 'styled-components'
import { theme } from './theme'

// and extend them!
declare module 'styled-components' {
  // export type DefaultTheme = typeof theme
  export interface DefaultTheme {
    background: string
    maxWidth: string
    borderRadius: string

    typography: {
      fontFamily: string
    }

    [x: string]: any
  }
}

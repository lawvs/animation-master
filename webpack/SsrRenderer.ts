// https://reactjs.org/docs/react-dom-server.html
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
// https://styled-components.com/docs/advanced#server-side-rendering
import { ServerStyleSheet } from 'styled-components'

import { SSR_STYLES_PLACEHOLDER, SSR_HTML_PLACEHOLDER } from './config'

export function render(jsx: JSX.Element) {
  const renderReact = process.env.SSR_STATIC
    ? renderToStaticMarkup
    : renderToString

  const sheet = new ServerStyleSheet()
  const html = renderReact(sheet.collectStyles(jsx))
  const styles = sheet.getStyleTags()
  sheet.seal()

  return {
    styles,
    html,
    placeholder: {
      styles: SSR_STYLES_PLACEHOLDER,
      html: SSR_HTML_PLACEHOLDER,
    },
  }
}

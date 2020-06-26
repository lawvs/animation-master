import url from 'url'

// Notice: use comment will be removed by HtmlWebpackPlugin.minify.removeComments)
export const SSR_STYLES_PLACEHOLDER = '<div hidden>ssr-styles-outlet</div>'
export const SSR_HTML_PLACEHOLDER = '<div hidden>ssr-html-outlet</div>'

export const config = {
  port: 3000, // dev server port
  outputDir: 'dist',
  publicPath: process.env.PUBLIC_URL
    ? (url.parse(process.env.PUBLIC_URL).pathname as string)
    : '.',

  // See https://github.com/jaketrent/html-webpack-template
  templateConfig: {
    title: process.env.npm_package_name,
    appMountId: 'root',

    inject: !process.env.SSR_STATIC,
    headHtmlSnippet: process.env.SSR && SSR_STYLES_PLACEHOLDER,
    appMountHtmlSnippet: process.env.SSR && SSR_HTML_PLACEHOLDER,

    // <meta content="width=device-width,initial-scale=1" name="viewport" />
    mobile: true,
    // See https://github.com/joshbuchea/HEAD#meta
    meta: [
      {
        name: 'description',
        content: process.env.npm_package_description,
      },
    ],
  },
} as const

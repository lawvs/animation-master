import path from 'path'
import merge from 'webpack-merge'
import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'

import baseWebpackConfig from './webpack.base.config'
import { config } from './config'
import { resolvePath } from './utils'

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration
}

const webpackConfig: Configuration = merge(baseWebpackConfig, {
  mode: 'development',
  // See https://webpack.js.org/configuration/devtool/
  devtool: 'cheap-module-eval-source-map',
  output: {
    publicPath: '/',
  },
  devServer: {
    port: config.port,
    open: true,
    historyApiFallback: true,
    contentBase: [
      resolvePath('public'), // static assets
      // @animation-master/content/src
      path.join(
        path.dirname(require.resolve('@animation-master/content')),
        'src'
      ),
    ],
  },
  performance: {
    hints: false,
  },
})

export default webpackConfig

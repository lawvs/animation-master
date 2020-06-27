import { devConfig, prodConfig } from '@animation-master/webpack'

let webpackConfig = null

if (process.argv.includes('--mode=development')) {
  webpackConfig = devConfig
}

if (process.argv.includes('--mode=production')) {
  webpackConfig = prodConfig
}

export default webpackConfig

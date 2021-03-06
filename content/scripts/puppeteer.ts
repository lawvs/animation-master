import path from 'path'
import puppeteer from 'puppeteer'
import { ensureDirSync } from 'fs-extra'

const CACHE_PATH = path.join('node_modules', '.cache', 'puppeteer')
const OUTPUT_PATH = path.join('build', 'thumbnails')
ensureDirSync(OUTPUT_PATH)

let browser: puppeteer.Browser | null = null

export const setupBrowser = async () => {
  if (browser) await browser.close()
  // See https://github.com/puppeteer/puppeteer/issues/1837
  const options = {
    args: [
      '--no-sandbox',
      // '--disable-setuid-sandbox',
      '--no-zygote',
      '--single-process',
      // '--disable-infobars',
      // '--disable-gpu',
      // '--disable-dev-shm-usage',
      // '--no-first-run',
    ],
    userDataDir: CACHE_PATH,
    // executablePath: '/usr/bin/chromium-browser',
  }
  browser = await puppeteer.launch(options)
  return browser
}

export const takeScreenshot = async ({
  url,
  viewport = {
    width: 500,
    height: 300,
  },
}: {
  url: string
  viewport?: puppeteer.Viewport
}) => {
  if (!browser) {
    throw new Error(
      'ERROR! Browser not found! Please run `createPuppeteerBrowser()` first.'
    )
  }
  const page = await browser.newPage()

  await page.setViewport(viewport)

  await page.goto(url)
  const screenshotPath = path.join(
    OUTPUT_PATH,
    `${encodeURIComponent(new URL(url).pathname)}.png`
  )
  // Wait some preparation animation
  await page.waitFor(500)
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  })
  await page.close()
  return screenshotPath
}

export const closeBrowser = async () => {
  if (browser) await browser.close()
  browser = null
}

export const getBrowser = () => browser

if (require.main === module) {
  const url = process.argv[2]

  setupBrowser().then(async () => {
    const screenshotPath = await takeScreenshot({ url })
    console.log(screenshotPath)
    closeBrowser()
  })
}

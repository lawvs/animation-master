import * as path from 'path'
import * as puppeteer from 'puppeteer'
import { ensureDirSync } from 'fs-extra'

const TMP_PATH = path.join('build', 'tmp')
const OUTPUT_PATH = path.join('build', 'thumbnail')
ensureDirSync(OUTPUT_PATH)

const options = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--window-position=0,0',
  ],
  headless: true,
  ignoreHTTPSErrors: true,
}

let browser: puppeteer.Browser = null

export const createPuppeteerBrowser = async () => {
  if (browser) await browser?.close()
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
    userDataDir: TMP_PATH,
    // executablePath: '/usr/bin/chromium-browser',
  }
  browser = await puppeteer.launch(options)
  return browser
}

export const screenshot = async ({
  url,
  viewport,
}: {
  url: string
  viewport: puppeteer.Viewport
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
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  })
  await page.close()
  return screenshotPath
}

export const closePuppeteerBrowser = async () => {
  await browser?.close()
  browser = null
}

export const getPuppeteerBrowser = () => browser

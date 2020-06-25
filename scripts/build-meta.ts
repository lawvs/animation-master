import * as fs from 'fs-extra'
import * as path from 'path'

import { JSDOM } from 'jsdom'
import { launchStaticServer } from './server'
import {
  createPuppeteerBrowser,
  closePuppeteerBrowser,
  screenshot,
} from './puppeteer'

const OUTPUT_PATH = path.resolve('build')
const FOLDER = 'content'
fs.ensureDirSync(OUTPUT_PATH)

const parseHTML = (html: string) => {
  const dom = new JSDOM(html)
  return {
    title: dom.window.document.title,
  }
}

const buildMeta = async () => {
  const thumbnailSize = {
    width: 500,
    height: 300,
  }
  const port = 5000
  const host = `localhost:${port}`
  const server = launchStaticServer({ port, directory: FOLDER })
  await createPuppeteerBrowser()

  const meta = await Promise.all(
    fs
      .readdirSync(FOLDER)
      .filter((maybeFolder) =>
        fs.statSync(path.resolve(FOLDER, maybeFolder)).isDirectory()
      )
      .map(async (dir) => ({
        name: dir,
        item: await Promise.all(
          fs
            .readdirSync(path.resolve(FOLDER, dir))
            .filter((maybeFolder) =>
              fs.statSync(path.resolve(FOLDER, dir, maybeFolder)).isDirectory()
            )
            .map(async (filename) => {
              const curPath = path.join(FOLDER, dir, filename)
              const thumbnail = path.relative(
                OUTPUT_PATH,
                await screenshot({
                  url: `http://${host}/${dir}/${filename}`,
                  viewport: thumbnailSize,
                })
              )

              return {
                id: filename,
                path: curPath,
                thumbnail,
                ...parseHTML(
                  fs.readFileSync(path.resolve(curPath, 'index.html'), {
                    encoding: 'utf-8',
                  })
                ),
              }
            })
        ),
      }))
  )

  fs.writeJSONSync(path.join(OUTPUT_PATH, 'meta.json'), meta, { spaces: 2 })
  await closePuppeteerBrowser()
  server.close()
}

buildMeta()

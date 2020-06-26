import * as fs from 'fs-extra'
import * as path from 'path'

import { JSDOM } from 'jsdom'
import { launchStaticServer } from './server'
import { setupBrowser, closeBrowser, takeScreenshot } from './puppeteer'

const OUTPUT_PATH = path.resolve('build')
const FOLDER = 'src'
fs.ensureDirSync(OUTPUT_PATH)

const parseHTML = (html: string) => {
  const dom = new JSDOM(html)
  return {
    title: dom.window.document.title,
  }
}

const buildMeta = async () => {
  const port = 5000
  const host = `localhost:${port}`
  const server = launchStaticServer({ port, directory: FOLDER })
  await setupBrowser()

  const meta = await Promise.all(
    fs
      .readdirSync(FOLDER)
      .filter((maybeFolder) =>
        fs.statSync(path.resolve(FOLDER, maybeFolder)).isDirectory()
      )
      .map(async (collectionDir) => ({
        name: collectionDir,
        item: await Promise.all(
          fs
            .readdirSync(path.resolve(FOLDER, collectionDir))
            .filter((maybeFolder) =>
              fs
                .statSync(path.resolve(FOLDER, collectionDir, maybeFolder))
                .isDirectory()
            )
            .map(async (itemDir) => {
              const curPath = path.join(FOLDER, collectionDir, itemDir)
              const thumbnail = path.relative(
                OUTPUT_PATH,
                await takeScreenshot({
                  url: `http://${host}/${collectionDir}/${itemDir}`,
                })
              )

              return {
                id: itemDir,
                path: path.join(collectionDir, itemDir),
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
  await closeBrowser()
  server.close()
}

buildMeta()

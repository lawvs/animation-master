import * as fs from 'fs-extra'
import * as path from 'path'

import { JSDOM } from 'jsdom'

const OUTPUT_PATH = path.resolve('build')
const FOLDER = 'content'
fs.ensureDirSync(OUTPUT_PATH)

const parseHTML = (html: string) => {
  const dom = new JSDOM(html)
  return {
    title: dom.window.document.title,
  }
}

const buildMeta = () => {
  const meta = fs
    .readdirSync(FOLDER)
    .filter((maybeFolder) =>
      fs.statSync(path.resolve(FOLDER, maybeFolder)).isDirectory()
    )
    .map((dir) => ({
      name: dir,
      item: fs
        .readdirSync(path.resolve(FOLDER, dir))
        .filter((maybeFolder) =>
          fs.statSync(path.resolve(FOLDER, dir, maybeFolder)).isDirectory()
        )
        .map((filename) => ({
          id: filename,
          path: path.join(FOLDER, dir, filename),
          ...parseHTML(
            fs.readFileSync(path.resolve(FOLDER, dir, filename, 'index.html'), {
              encoding: 'utf-8',
            })
          ),
        })),
    }))

  fs.writeJSONSync(path.join(OUTPUT_PATH, 'meta.json'), meta, { spaces: 2 })
}

buildMeta()

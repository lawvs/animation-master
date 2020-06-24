import * as fs from 'fs-extra'
import * as path from 'path'

const OUTPUT_PATH = path.resolve('build')
const FOLDER = 'content'

const buildMeta = () => {
  const meta = fs
    .readdirSync(FOLDER)
    .filter(
      (maybeFolder) =>
        fs.statSync(path.resolve(FOLDER, maybeFolder)).isDirectory
    )
    .map((dir) => ({
      name: dir,
      item: fs.readdirSync(path.resolve(FOLDER, dir)).map((filename) => ({
        id: filename,
        path: path.join(FOLDER, dir, filename),
      })),
    }))

  fs.writeJSONSync(path.join(OUTPUT_PATH, 'meta.json'), meta, { spaces: 2 })
}

buildMeta()

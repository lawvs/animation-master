import * as path from 'path'

export const resolvePath = (dir = '') => path.join(process.cwd(), dir)

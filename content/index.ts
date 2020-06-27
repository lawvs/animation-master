import meta from './build/meta.json'

export type AnimationCollection = typeof meta extends (infer T)[] ? T : unknown
export type AnimationItem = AnimationCollection['item'] extends (infer T)[]
  ? T
  : unknown

export { meta }

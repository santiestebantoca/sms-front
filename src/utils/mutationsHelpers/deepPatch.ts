export interface DeepPatchOptions {
  replaceArrays?: boolean
  ignoreUndefined?: boolean
}

export function deepPatch<T extends Record<string, any>>(
  target: T,
  source: Partial<T>,
  options: DeepPatchOptions = {}
): T {
  const resolved: Required<DeepPatchOptions> = {
    replaceArrays: true,
    ignoreUndefined: true,
    ...options
  }

  const result = { ...target }
  deepPatchImpl(result, source, resolved)
  return result
}

function deepPatchImpl(
  target: Record<string, any>,
  source: Record<string, any>,
  options: Required<DeepPatchOptions>
): void {
  if (!target || typeof target !== 'object' || !source || typeof source !== 'object') return

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue

    const srcVal = source[key]
    if (options.ignoreUndefined && srcVal === undefined) continue

    const tgtVal = target[key]
    const isPlainObj = (v: any) =>
      v !== null &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      !(v instanceof Date) &&
      !(v instanceof RegExp)

    if (isPlainObj(srcVal) && isPlainObj(tgtVal)) {
      target[key] = { ...tgtVal }
      deepPatchImpl(target[key], srcVal, options)
    } else {
      target[key] = srcVal
    }
  }
}
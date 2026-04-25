export interface DeepPatchOptions {
  replaceArrays?: boolean
  ignoreUndefined?: boolean
}

/**
 * API pública: mantiene type safety y permite opciones parciales
 */
export function deepPatch<T extends Record<string, any>>(
  target: T,
  source: Partial<T>,
  options: DeepPatchOptions = {}
): void {
  // 1️⃣ Resuelve defaults aquí. El spread garantiza que todas las claves sean `boolean`
  const resolved: Required<DeepPatchOptions> = {
    replaceArrays: true,
    ignoreUndefined: true,
    ...options
  }

  // 2️⃣ Pasa el objeto ya completo a la implementación interna
  deepPatchImpl(target, source, resolved)
}

/**
 * Implementación interna: asume que todas las opciones están definidas
 */
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
      // Fusión recursiva manteniendo referencias
      deepPatchImpl(tgtVal, srcVal, options)
    } else {
      // Arrays, primitivos, Date → reemplazo directo (Vue 3 lo hace reactivo)
      target[key] = srcVal
    }
  }
}
export function flatToTree(items, opts = {}) {
  const {
    idKey = 'id',
    parentKey = 'parent_id',
    childrenKey = 'children',
    rootValue = null // valor que indica "es raíz"
  } = opts

  const map = new Map()
  const roots = []

  // 1. Indexar todos los nodos
  for (const item of items) {
    map.set(item[idKey], { ...item, [childrenKey]: [] })
  }

  // 2. Vincular hijos a padres y recoger raíces
  for (const item of items) {
    const node = map.get(item[idKey])
    const parentId = item[parentKey]

    if (parentId !== rootValue && map.has(parentId)) {
      map.get(parentId)[childrenKey].push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

// Ejemplo:
// const flatData = [
//   { id: 3, parent_id: 1, name: 'Hijo B' },
//   { id: 1, parent_id: null, name: 'Raíz' },
//   { id: 2, parent_id: 1, name: 'Hijo A' },
//   { id: 4, parent_id: 2, name: 'Nieto A1' }
// ]

// console.log(flatToTree(flatData))
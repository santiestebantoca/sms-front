type FlatTreeNode = Record<string, any> & {
  children?: FlatTreeNode[]
}

type FlatTreeItem = Record<string, any>

type FlatTreeOptions = {
  idKey?: string
  parentKey?: string
  childrenKey?: string
  rootValue?: unknown
}

export function flatToTree(items: FlatTreeItem[] = [], opts: FlatTreeOptions = {}) {
  const {
    idKey = 'id',
    parentKey = 'parent_id',
    childrenKey = 'children',
    rootValue = null
  } = opts

  const map = new Map<string | number, FlatTreeNode>()
  const roots: FlatTreeNode[] = []

  for (const item of items) {
    map.set(item[idKey], { ...item, [childrenKey]: [] })
  }

  for (const item of items) {
    const node = map.get(item[idKey])
    const parentId = item[parentKey]

    if (!node) continue

    if (parentId !== rootValue && map.has(parentId)) {
      const parent = map.get(parentId)
      if (parent) parent[childrenKey].push(node)
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
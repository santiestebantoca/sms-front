export function patch(data, item, attr) {
  if (Array.isArray(data)) {
    return data.map(_item => _item.id === item.id ? { ..._item, ...item } : _item)
  }
  else if (typeof data === 'object') {
    if (attr) { // data[attr] es un array que contiene el item mutado
      if (!data[attr]) return data[attr]
      return {
        ...data,
        [attr]: data[attr].map(_item => _item.id === item.id ? { ..._item, ...item } : _item)
      }
    }
    else
      return { ...data, ...item }
  }
  return data
}

export function remove(data, id, attr) {
  if (Array.isArray(data)) {
    return data.filter(item => item.id !== id)
  }
  else if (typeof data === 'object') {
    if (attr) { // data[attr] es un array que contiene el item mutado
      if (!data[attr]) return data[attr]
      return {
        ...data,
        [attr]: data[attr].filter(item => item.id !== id)
      }
    }
  }
  return data
}

export function push(data, item, attr) {
  if (Array.isArray(data)) {
    return [...data, item]
  }
  else if (typeof data === 'object') {
    if (attr) {
      return {
        ...data,
        [attr]: [...(data[attr] || []), item]
      }
    }
  }
  return data
}

export function unshift(data, item, attr) {
  if (Array.isArray(data)) {
    return [item, ...data]
  }
  else if (typeof data === 'object') {
    if (attr) {
      return {
        ...data,
        [attr]: [item, ...(data[attr] || [])]
      }
    }
  }
  return data
}

export function replace(data, tempId, item, attr) {
  if (Array.isArray(data)) {
    return data.map(_item => _item.id === tempId ? item : _item)
  }
  else if (typeof data === 'object') {
    if (attr) {
      return {
        ...data,
        [attr]: (data[attr] || []).map(_item => _item.id === tempId ? item : _item)
      }
    }
  }
  return data
}

export function satisfies(data, filterObj, claveMap = { search: 'texto' }) {
  if ((typeof data === 'object') && (typeof filterObj === 'object')) {
    for (const clave of Object.keys(filterObj)) {
      const key = claveMap[clave]
      if (!data.hasOwnProperty(key)) return false
      const str = data[key].toLowerCase()
      const subStr = filterObj[clave].toLowerCase()
      if (!str.includes(subStr)) return false
    }
  }
  return true
}
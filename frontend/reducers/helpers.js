export function isLoading(state) {
  return {
    ...state,
    isLoading: true
  }
}

export const failed = (state, action) => returnPayload(state, 'errors', action.payload)

export function returnPayload(state, name, payload) {
  return {
    ...state,
    isLoading: false,
    [name]: payload
  }
}

export function appendNew(list, newItem) {
  const newList = list.slice()
  newList.push(newItem)
  return newList
}

export function removeID(list, id) {
  let removeIdx
  list.forEach((item, idx) => {
    if (item.id === id) {
      removeIdx = idx
    }
  })
  const newList = list.slice(0)
  newList.splice(removeIdx, 1)
  return newList
}

export function updateItem(list, updatedItem) {
  return list.map(item => (item.id === updatedItem.id ? updatedItem : item))
}

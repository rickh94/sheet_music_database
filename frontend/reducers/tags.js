import { isLoading, returnPayload, failed } from './helpers'
const initialState = {
  tags: [],
  isLoading: false,
  errors: {}
}

function appendTag(tagList, newTag) {
  const newTagList = tagList.slice(0)
  newTagList.push(newTag)
  return newTagList
}

function removeTag(tagList, id) {
  const newTagList = tagList.slice(0)
  let tagIdx
  tagList.forEach((tag, idx) => {
    if (tag.id == id) {
      tagIdx = idx
    }
  })
  newTagList.splice(tagIdx, 1)
  return newTagList
}

function updateTag(tagList, updatedTag) {
  const newTagList = tagList.map(tag => (tag.id == updatedTag.id ? updatedTag : tag))
  return newTagList
}

export default function tags(state = initialState, action) {
  switch (action.type) {
    case 'GET_TAGS':
    case 'CREATE_TAG':
    case 'UPDATE_TAG':
    case 'DELETE_TAG':
      return isLoading(state)

    case 'GET_TAGS_SUCCESSFUL':
      return returnPayload(state, 'tags', action.payload)

    case 'DELETE_TAG_SUCCESSFUL':
      return returnPayload(state, 'tags', removeTag(state.tags, action.payload))

    case 'UPDATE_TAG_SUCCESSFUL':
      return returnPayload(state, 'tags', updateTag(state.tags, action.payload))

    case 'CREATE_TAG_SUCCESSFUL':
      return returnPayload(state, 'tags', appendTag(state.tags, action.payload))

    case 'GET_TAGS_FAILED':
    case 'CREATE_TAG_FAILED':
    case 'UPDATE_TAG_FAILED':
    case 'DELETE_TAG_FAILED':
      return failed(state, action)

    default:
      return state
  }
}

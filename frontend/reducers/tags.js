import { isLoading, returnPayload, failed, appendNew, removeID, updateItem } from './helpers'
const initialState = {
  list: [],
  isLoading: false,
  errors: {}
}

export default function tags(state = initialState, action) {
  switch (action.type) {
    case 'GET_TAGS':
    case 'CREATE_TAG':
    case 'UPDATE_TAG':
    case 'DELETE_TAG':
      return isLoading(state)

    case 'GET_TAGS_SUCCESSFUL':
      return returnPayload(state, 'list', action.payload)

    case 'DELETE_TAG_SUCCESSFUL':
      return returnPayload(state, 'list', removeID(state.list, action.payload))

    case 'UPDATE_TAG_SUCCESSFUL':
      return returnPayload(state, 'list', updateItem(state.list, action.payload))

    case 'CREATE_TAG_SUCCESSFUL':
      return returnPayload(state, 'list', appendNew(state.list, action.payload))

    case 'GET_TAGS_FAILED':
    case 'CREATE_TAG_FAILED':
    case 'UPDATE_TAG_FAILED':
    case 'DELETE_TAG_FAILED':
      return failed(state, action)

    default:
      return state
  }
}

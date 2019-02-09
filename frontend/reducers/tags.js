import { isLoading, returnPayload, failed } from './helpers'
const initialState = {
  tags: [],
  isLoading: false,
  errors: {}
}

export default function tags(state = initialState, action) {
  switch (action.type) {
    case 'GET_TAGS':
    case 'CREATE_TAG':
    case 'UPDATE_TAG':
      return isLoading(state)

    case 'GET_TAGS_SUCCESSFUL':
    case 'CREATE_TAG_SUCCESSFUL':
    case 'UPDATE_TAG_SUCCESSFUL':
      return returnPayload(state, 'tags', action.payload)

    case 'GET_TAGS_FAILED':
    case 'CREATE_TAG_FAILED':
    case 'UPDATE_TAG_FAILED':
      return failed(state, action)

    default:
      return state
  }
}

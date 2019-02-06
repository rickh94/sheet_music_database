import { isLoading, returnPayload, failed } from './helpers'
const initialState = {
  tags: [],
  isLoading: false,
  error: {}
}

export default function tags(state = initialState, action) {
  switch (action.type) {
    case 'GET_TAGS':
      return isLoading(state)

    case 'GET_TAGS_SUCCESSFUL':
      return returnPayload(state, 'tags', action.payload)

    default:
      return state
  }
}

import { isLoading, returnPayload, failed, appendNew, removeID, updateItem } from './helpers'
const initialState = {
  list: [],
  isLoading: false,
  errors: {},
  composer: {}
}

export default function tags(state = initialState, action) {
  switch (action.type) {
    case 'GET_COMPOSERS':
    case 'CREATE_COMPOSER':
    case 'UPDATE_COMPOSER':
    case 'DELETE_COMPOSER':
    case 'GET_COMPOSER':
    case 'UPDATE_SINGLE_COMPOSER':
      return isLoading(state)

    case 'GET_COMPOSERS_SUCCESSFUL':
      return returnPayload(state, 'list', action.payload)

    case 'GET_COMPOSER_SUCCESSFUL':
      return returnPayload(state, 'composer', action.payload)

    case 'DELETE_COMPOSER_SUCCESSFUL':
      return returnPayload(state, 'list', removeID(state.list, action.payload))

    case 'UPDATE_COMPOSER_SUCCESSFUL':
      return returnPayload(state, 'list', updateItem(state.list, action.payload))

    case 'UPDATE_SINGLE_COMPOSER_SUCCESSFUL':
      return returnPayload(state, 'composer', action.payload)

    case 'CREATE_COMPOSER_SUCCESSFUL':
      return returnPayload(state, 'list', appendNew(state.list, action.payload))

    case 'GET_COMPOSERS_FAILED':
    case 'GET_COMPOSER_FAILED':
    case 'CREATE_COMPOSER_FAILED':
    case 'UPDATE_COMPOSER_FAILED':
    case 'DELETE_COMPOSER_FAILED':
    case 'UPDATE_SINGLE_COMPOSER_FAILED':
      return failed(state, action)

    default:
      return state
  }
}

import {
  isLoading,
  returnPayload,
  failed,
  appendNew,
  updateItem,
  removeID
} from './helpers'

const initialState = {
  list: [],
  isLoading: false,
  errors: {}
}

export default function instruments(state = initialState, action) {
  switch (action.type) {
    case 'GET_INSTRUMENTS':
    case 'CREATE_INSTRUMENT':
    case 'UPDATE_INSTRUMENT':
    case 'DELETE_INSTRUMENT':
      return isLoading(state)

    case 'GET_INSTRUMENTS_SUCCESSFUL':
      return returnPayload(state, 'list', action.payload)

    case 'CREATE_INSTRUMENT_SUCCESSFUL':
      return returnPayload(state, 'list', appendNew(state.list, action.payload))

    case 'UPDATE_INSTRUMENT_SUCCESSFUL':
      return returnPayload(state, 'list', updateItem(state.list, action.payload))

    case 'DELETE_INSTRUMENT_SUCCESSFUL':
      return returnPayload(state, 'list', removeID(state.list, action.payload))

    case 'GET_INSTRUMENTS_FAILED':
    case 'CREATE_INSTRUMENT_FAILED':
    case 'UPDATE_INSTRUMENT_FAILED':
    case 'DELETE_INSTRUMENT_FAILED':
      return failed(state, action)

    default:
      return state
  }
}

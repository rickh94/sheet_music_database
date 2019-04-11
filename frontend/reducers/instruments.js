import { isLoading, returnPayload, failed, appendNew } from './helpers'

const initialState = {
  list: [],
  isLoading: false,
  errors: {}
}

export default function instruments(state = initialState, action) {
  switch (action.type) {
    case 'GET_INSTRUMENTS':
    case 'CREATE_INSTRUMENT':
      return isLoading(state)

    case 'GET_INSTRUMENTS_SUCCESSFUL':
      return returnPayload(state, 'list', action.payload)

    case 'CREATE_INSTRUMENT_SUCCESSFUL':
      return returnPayload(state, 'list', appendNew(state.list, action.payload))

    case 'GET_INSTRUMENTS_FAILED':
      return failed(state, action)

    default:
      return state
  }
}

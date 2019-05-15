import { isLoading, returnPayload, failed, appendNew, updateItem, removeID } from './helpers'

const initialState = {
  list: [],
  isLoading: false,
  errors: {},
  sheet: {}
}

export default function sheets(state = initialState, action) {
  switch (action.type) {
    case 'GET_SHEETS':
    case 'GET_SHEET':
    case 'CREATE_SHEET':
    case 'UPDATE_SHEET':
    case 'UPDATE_SINGLE_SHEET':
    case 'DELETE_SHEET':
      return isLoading(state)

    case 'GET_SHEETS_SUCCESSFUL':
      return returnPayload(state, 'list', action.payload)

    case 'GET_SHEET_SUCCESSFUL':
      return returnPayload(state, 'sheet', action.payload)

    case 'CREATE_SHEET_SUCCESSFUL':
      return returnPayload(state, 'list', appendNew(state.list, action.payload))

    case 'UPDATE_SHEET_SUCCESSFUL':
      return returnPayload(state, 'list', updateItem(state.list, action.payload))

    case 'UPDATE_SINGLE_SHEET_SUCCESSFUL':
      return returnPayload(state, 'sheet', action.payload)

    case 'DELETE_SHEET_SUCCESSFUL':
      return returnPayload(state, 'list', removeID(state.list, action.payload))

    case 'GET_SHEETS_FAILED':
    case 'GET_SHEET_FAILED':
    case 'CREATE_SHEET_FAILED':
    case 'UPDATE_SHEET_FAILED':
    case 'UPDATE_SINGLE_SHEET_FAILED':
    case 'DELETE_SHEET_FAILED':
      return failed(state, action)

    default:
      return state
  }
}

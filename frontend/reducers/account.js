import { isLoading, failed, returnPayload } from './helpers'

const initialState = {
  token: null,
  isLoading: false,
  errors: {},
  profile: {
    first_name: '',
    last_name: '',
    username: '',
    email: ''
  }
}

export default function account(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
    case 'REGISTER':
    case 'LOGOUT':
    case 'PROFILE':
      return isLoading(state)

    case 'LOGIN_SUCCESSFUL':
    case 'REGISTER_SUCCESSFUL':
      return returnPayload(state, 'token', action.payload.token)

    case 'REGISTER_FAILED':
      return failed(state, action)

    case 'LOGOUT_SUCCESSFUL':
      return returnPayload(state, 'token', null)

    case 'PROFILE_UPDATE_SUCCESSFUL':
    case 'PROFILE_GET_SUCCESSFUL':
      return returnPayload(state, 'profile', action.payload)

    case 'LOGIN_FAILED':
    case 'LOGOUT_FAILED':
    case 'PROFILE_GET_FAILED':
    case 'PROFILE_UPDATE_FAILED':
      return failed(state, action)

    default:
      return state
  }
}

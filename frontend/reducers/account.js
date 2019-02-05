const initialState = {
  token: null,
  isLoading: false,
  errors: {}
}

function isLoading(state) {
  return {
    ...state,
    isLoading: true
  }
}

function failed(state, action) {
  return {
    ...state,
    isLoading: false,
    errors: action.payload
  }
}

export default function app(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return isLoading(state)

    case 'LOGIN_SUCCESSFUL':
      return {
        ...state,
        token: action.payload.token,
        isLoading: false
      }

    case 'LOGIN_FAILED':
      return failed(state, action)

    case 'REGISTER':
      return isLoading(state)

    case 'REGISTER_SUCCESSFUL':
      return {
        ...state,
        isLoading: false,
        token: action.payload.token
      }

    case 'REGISTER_FAILED':
      return failed(state, action)

    case 'LOGOUT':
      return isLoading(state)

    case 'LOGOUT_SUCCESSFUL':
      return {
        ...state,
        isLoading: false,
        token: null
      }

    case 'LOGOUT_FAILED':
      return failed(state, action)

    case 'PROFILE':
      return isLoading(state)

    case 'PROFILE_GET_SUCCESSFUL':
      return {
        ...state,
        isLoading: false,
        profile: action.payload
      }

    case 'PROFILE_GET_FAILED':
      return failed(state, action)

    case 'PROFILE_UPDATE_SUCCESSFUL':
      return {
        ...state,
        isLoading: false,
        profile: action.payload
      }

    case 'PROFILE_UPDATE_FAILED':
      return failed(state, action)

    default:
      return state
  }
}

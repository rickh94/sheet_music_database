const initialState = {
  token: null,
  isLoading: false,
  errors: {}
}

export default function app(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isLoading: true
      }

    case 'LOGIN_SUCCESSFUL':
      return {
        ...state,
        token: action.payload.token,
        isLoading: false
      }
    case 'LOGIN_FAILED':
      return {
        ...state,
        isLoading: false,
        errors: action.payload
      }
    case 'REGISTER':
      return {
        ...state,
        isLoading: true
      }
    case 'REGISTER_SUCCESSFUL':
      return {
        ...state,
        isLoading: false,
        token: action.payload.token
      }
    case 'REGISTER_FAILED':
      return {
        ...state,
        isLoading: false,
        errors: action.payload
      }
    default:
      return state
  }
}

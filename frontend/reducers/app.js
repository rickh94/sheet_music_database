const initialState = {
  token: null,
  isLoading: false,
  errors: {},
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
    default:
      return state
  }
}

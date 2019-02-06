export function isLoading(state) {
  return {
    ...state,
    isLoading: true
  }
}

export const failed = (state, action) => returnPayload(state, 'errors', action.payload)

export function returnPayload(state, name, payload) {
  return {
    ...state,
    isLoading: false,
    [name]: payload
  }
}

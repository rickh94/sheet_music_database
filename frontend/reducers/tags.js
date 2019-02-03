const initialState = {
  tags: {
    id: 1,
    name: 'Test Tag'
  },
  isLoading: false,
  error: {}
}

export default function tags(state = initialState, action) {
  let taglist = state.slice()
  switch (action.type) {
    case 'FETCH_TAGS':
      return { ...state, isLoading: true }

    case 'FETCH_TAGS_SUCCESS':
      return { ... state}

    default:
      return state
  }
}

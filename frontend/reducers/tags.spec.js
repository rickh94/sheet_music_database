import tagReducer from './tags'

const initialState = {
  tags: [],
  isLoading: false,
  error: {}
}

describe('tag reducer', () => {
  it('should return the initial state', () => {
    expect(tagReducer(undefined, {})).toEqual(initialState)
  })

  it('should return existing state', () => {
    const someState = { tags: ['tag1', 'tag2'], isLoading: false }
    expect(tagReducer(someState, {})).toEqual(someState)
  })

  describe('get actions', () => {
    it('should set isLoading', () => {
      expect(tagReducer(undefined, { type: 'GET_TAGS' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return tag list and unset is loading if successful', () => {
      const tags = ['tag1', 'tag2', 'tag3']
      expect(
        tagReducer(
          { ...initialState, isLoading: true },
          { type: 'GET_TAGS_SUCCESSFUL', payload: tags }
        )
      ).toEqual({ ...initialState, isLoading: false, tags })
    })
  })
})

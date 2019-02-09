import tagReducer from './tags'

describe('tag reducer', () => {
  const errors = { someError: 'error' }
  const initialState = {
    tags: [],
    isLoading: false,
    errors: {}
  }
  const tags = ['tag1', 'tag2', 'tag3']
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

    it('should return tag list and unset is loading if get successful', () => {
      expect(
        tagReducer(
          { ...initialState, isLoading: true },
          { type: 'GET_TAGS_SUCCESSFUL', payload: tags }
        )
      ).toEqual({ ...initialState, isLoading: false, tags })
    })

    it('should return the errors if get unsuccessful', () => {
      expect(
        tagReducer(
          { ...initialState, isLoading: false },
          { type: 'GET_TAGS_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })

    it('sets isLoading on create tag', () => {
      expect(tagReducer(undefined, { type: 'CREATE_TAG' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return the new taglist on create successful', () => {
      expect(
        tagReducer(
          { ...initialState, isLoading: true },
          { type: 'CREATE_TAG_SUCCESSFUL', payload: tags }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        tags
      })
    })

    it('should return the errors on create failed', () => {
      expect(
        tagReducer(
          { ...initialState, isLoading: true },
          { type: 'CREATE_TAG_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })
  })

  it('sets isLoading on update tag', () => {
    expect(tagReducer(undefined, { type: 'UPDATE_TAG' })).toEqual({
      ...initialState,
      isLoading: true
    })
  })

  it('should return the new taglist on update successful', () => {
    expect(
      tagReducer(
        { ...initialState, isLoading: true },
        { type: 'UPDATE_TAG_SUCCESSFUL', payload: tags }
      )
    ).toEqual({
      ...initialState,
      isLoading: false,
      tags
    })
  })

  it('should return the errors on update failed', () => {
    expect(
      tagReducer(
        { ...initialState, isLoading: true },
        { type: 'UPDATE_TAG_FAILED', payload: errors }
      )
    ).toEqual({ ...initialState, isLoading: false, errors })
  })
})

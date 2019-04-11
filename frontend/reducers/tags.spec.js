import tagReducer from './tags'

describe('tag reducer', () => {
  const errors = { someError: 'error' }
  const initialState = {
    list: [],
    isLoading: false,
    errors: {}
  }
  const tags = [
    { id: 1, name: 'tag1' },
    { id: 2, name: 'tag2' },
    { id: 3, name: 'tag3' }
  ]
  it('should return the initial state', () => {
    expect(tagReducer(undefined, {})).toEqual(initialState)
  })

  it('should return existing state', () => {
    const someState = { list: ['tag1', 'tag2'], isLoading: false }
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
      ).toEqual({ ...initialState, isLoading: false, list: tags })
    })

    it('should return the errors if get unsuccessful', () => {
      expect(
        tagReducer(
          { ...initialState, isLoading: false },
          { type: 'GET_TAGS_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })
  })
  describe('create actions', () => {
    it('sets isLoading on create tag', () => {
      expect(tagReducer(undefined, { type: 'CREATE_TAG' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return the new taglist on create successful', () => {
      const tags = [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
        { id: 3, name: 'tag3' }
      ]
      const newTag = { id: 4, name: 'tag4' }
      const newTags = tags.concat([newTag])
      expect(
        tagReducer(
          { ...initialState, list: tags, isLoading: true },
          { type: 'CREATE_TAG_SUCCESSFUL', payload: newTag }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        list: newTags
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

  describe('update actions', () => {
    it('sets isLoading on update tag', () => {
      expect(tagReducer(undefined, { type: 'UPDATE_TAG' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return the new taglist on update successful', () => {
      const updatedTag = { id: 3, name: 'updated' }
      const updatedTags = [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
        { id: 3, name: 'updated' }
      ]
      expect(
        tagReducer(
          { ...initialState, list: tags, isLoading: true },
          { type: 'UPDATE_TAG_SUCCESSFUL', payload: updatedTag }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        list: updatedTags
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

  describe('delete actions', () => {
    it('sets isLoading on delete tag', () => {
      expect(tagReducer(undefined, { type: 'DELETE_TAG' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return the new taglist on delete successful', () => {
      const newTags = [{ id: 1, name: 'tag1' }, { id: 3, name: 'tag3' }]
      expect(
        tagReducer(
          { ...initialState, list: tags, isLoading: true },
          { type: 'DELETE_TAG_SUCCESSFUL', payload: 2 }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        list: newTags
      })
    })

    it('should return the errors on delete failed', () => {
      expect(
        tagReducer(
          { ...initialState, isLoading: true },
          { type: 'DELETE_TAG_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })
  })
})

import composerReducer from './composers'

describe('composer reducer', () => {
  const errors = { someError: 'error' }
  const initialState = {
    list: [],
    isLoading: false,
    errors: {},
    composer: {}
  }
  const composerList = [
    { id: 1, name: 'test composer' },
    { id: 2, name: 'test2', era: '123' },
    { id: 3, name: 'composer3', is_alive: true }
  ]
  it('should return the initial state', () => {
    expect(composerReducer(undefined, {})).toEqual(initialState)
  })

  it('should return existing state', () => {
    const someState = { list: composerList, isLoading: false }
    expect(composerReducer(someState, {})).toEqual(someState)
  })

  describe('get actions', () => {
    it('should set isLoading', () => {
      expect(composerReducer(undefined, { type: 'GET_COMPOSERS' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should set isLoading', () => {
      expect(composerReducer(undefined, { type: 'GET_COMPOSER' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return composer and unset is loading if get successful', () => {
      expect(
        composerReducer(
          { ...initialState, isLoading: true },
          { type: 'GET_COMPOSER_SUCCESSFUL', payload: composerList[0] }
        )
      ).toEqual({ ...initialState, isLoading: false, composer: composerList[0] })
    })

    it('should return composer list and unset is loading if get successful', () => {
      expect(
        composerReducer(
          { ...initialState, isLoading: true },
          { type: 'GET_COMPOSERS_SUCCESSFUL', payload: composerList }
        )
      ).toEqual({ ...initialState, isLoading: false, list: composerList })
    })

    it('should return the errors if get unsuccessful', () => {
      expect(
        composerReducer(
          { ...initialState, isLoading: false },
          { type: 'GET_COMPOSERS_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })

    it('should return the errors if get unsuccessful', () => {
      expect(
        composerReducer(
          { ...initialState, isLoading: false },
          { type: 'GET_COMPOSER_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })

    it('sets isLoading on create composer', () => {
      expect(composerReducer(undefined, { type: 'CREATE_COMPOSER' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return the new composerlist on create successful', () => {
      const newComposer = { id: 4, name: 'composer4' }
      const newComposers = composerList.concat([newComposer])
      expect(
        composerReducer(
          { ...initialState, list: composerList, isLoading: true },
          { type: 'CREATE_COMPOSER_SUCCESSFUL', payload: newComposer }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        list: newComposers
      })
    })

    it('should return the errors on create failed', () => {
      expect(
        composerReducer(
          { ...initialState, isLoading: true },
          { type: 'CREATE_COMPOSER_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })
  })

  it('sets isLoading on update composer', () => {
    expect(composerReducer(undefined, { type: 'UPDATE_COMPOSER' })).toEqual({
      ...initialState,
      isLoading: true
    })
  })

  it('sets isLoading on update single composer', () => {
    expect(composerReducer(undefined, { type: 'UPDATE_SINGLE_COMPOSER' })).toEqual({
      ...initialState,
      isLoading: true
    })
  })

  it('should return the new composerlist on update successful', () => {
    const updatedComposer = { id: 3, name: 'updated' }
    const updatedComposers = [
      composerList[0],
      composerList[1],
      { id: 3, name: 'updated' }
    ]
    expect(
      composerReducer(
        { ...initialState, list: composerList, isLoading: true },
        { type: 'UPDATE_COMPOSER_SUCCESSFUL', payload: updatedComposer }
      )
    ).toEqual({
      ...initialState,
      isLoading: false,
      list: updatedComposers
    })
  })

  it('should return the updated composer on update successful', () => {
    const updatedComposer = { id: 3, name: 'updated' }
    expect(
      composerReducer(
        { ...initialState, composer: composerList[2], isLoading: true },
        { type: 'UPDATE_SINGLE_COMPOSER_SUCCESSFUL', payload: updatedComposer }
      )
    ).toEqual({
      ...initialState,
      isLoading: false,
      composer: updatedComposer
    })
  })

  it('should return the errors on update failed', () => {
    expect(
      composerReducer(
        { ...initialState, isLoading: true },
        { type: 'UPDATE_COMPOSER_FAILED', payload: errors }
      )
    ).toEqual({ ...initialState, isLoading: false, errors })
  })

  it('should return the errors on update failed', () => {
    expect(
      composerReducer(
        { ...initialState, isLoading: true },
        { type: 'UPDATE_SINGLE_COMPOSER_FAILED', payload: errors }
      )
    ).toEqual({ ...initialState, isLoading: false, errors })
  })

  it('sets isLoading on delete composer', () => {
    expect(composerReducer(undefined, { type: 'DELETE_COMPOSER' })).toEqual({
      ...initialState,
      isLoading: true
    })
  })

  it('should return the new composerlist on delete successful', () => {
    const newComposers = [composerList[0], composerList[2]]
    expect(
      composerReducer(
        { ...initialState, list: composerList, isLoading: true },
        { type: 'DELETE_COMPOSER_SUCCESSFUL', payload: 2 }
      )
    ).toEqual({
      ...initialState,
      isLoading: false,
      list: newComposers
    })
  })

  it('should return the errors on delete failed', () => {
    expect(
      composerReducer(
        { ...initialState, isLoading: true },
        { type: 'DELETE_COMPOSER_FAILED', payload: errors }
      )
    ).toEqual({ ...initialState, isLoading: false, errors })
  })
})

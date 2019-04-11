import instrumentReducer from './instruments'

describe('instrument reducer', () => {
  const errors = { someError: 'error' }
  const initialState = {
    list: [],
    isLoading: false,
    errors: {}
  }

  const instruments = [
    { id: 1, name: 'violin' },
    { id: 2, name: 'viola' },
    { id: 3, name: 'violoncello' }
  ]

  it('should return the initial state', () => {
    expect(instrumentReducer(undefined, {})).toEqual(initialState)
  })

  it('should return existing state', () => {
    const someState = { list: ['instrument1', 'instrument2'], isLoading: false }
    expect(instrumentReducer(someState, {})).toEqual(someState)
  })

  describe('get actions', () => {
    it('should set isLoading', () => {
      expect(instrumentReducer(undefined, { type: 'GET_INSTRUMENTS' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return the instrument list and unset is loading if get successful', () => {
      expect(
        instrumentReducer(
          { ...initialState, isLoading: true },
          { type: 'GET_INSTRUMENTS_SUCCESSFUL', payload: instruments }
        )
      ).toEqual({ ...initialState, isLoading: false, list: instruments })
    })

    it('should return the errors if get unsuccessful', () => {
      expect(
        instrumentReducer(
          { ...initialState, isLoading: true },
          { type: 'GET_INSTRUMENTS_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })
  })

  describe('create actions', () => {
    it('sets isLoading on create instrument', () => {
      expect(instrumentReducer(undefined, { type: 'CREATE_INSTRUMENT' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return the new instrument list on create successful', () => {
      const newInstrument = { id: 4, name: 'clarinet' }
      const newInstruments = instruments.concat([newInstrument])
      expect(
        instrumentReducer(
          { ...initialState, list: instruments, isLoading: true },
          { type: 'CREATE_INSTRUMENT_SUCCESSFUL', payload: newInstrument }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        list: newInstruments
      })
    })
  })
})

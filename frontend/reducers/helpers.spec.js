import * as helpers from './helpers'

describe('helper functions', () => {
  const state = { some: 'state' }
  describe('isLoading', () => {
    it('returns existing state and sets isLoading', () => {
      expect(helpers.isLoading({ some: 'state' })).toEqual({
        ...state,
        isLoading: true
      })
    })
  })

  describe('failed', () => {
    it('returns errors and unsets isLoading', () => {
      const error = 'some error'
      expect(helpers.failed(state, { payload: error })).toEqual({
        ...state,
        errors: error,
        isLoading: false
      })
    })
  })

  describe('returnPayload', () => {
    it('returns the payload as part of state assigned to passed in name', () => {
      const payload = 'some text i want to add to state'
      expect(helpers.returnPayload(state, 'test', payload)).toEqual({
        ...state,
        isLoading: false,
        test: payload
      })
    })
  })
})

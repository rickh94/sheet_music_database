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

describe('appendNew', () => {
  it('returns a new list of items', () => {
    const initList = [1, 2, 3]
    expect(helpers.appendNew(initList, 4)).toEqual([1, 2, 3, 4])
    expect(initList).toEqual([1, 2, 3])
  })
})

describe('removeID', () => {
  it('removes the item matching the id and returns a new list', () => {
    const initList = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(helpers.removeID(initList, 2)).toEqual([{ id: 1 }, { id: 3 }])
    expect(initList).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })
})

describe('updateItem', () => {
  it('replaces item with new item based on id and returns a new list', () => {
    const initList = [{ id: 1 }, { id: 2 }, { id: 3 }]
    expect(helpers.updateItem(initList, { id: 1, name: 'test' })).toEqual([
      { id: 1, name: 'test' },
      { id: 2 },
      { id: 3 }
    ])
    expect(initList).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
  })
})

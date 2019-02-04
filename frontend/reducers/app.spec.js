import appReducer from './app'

const initialState = {
  token: null,
  isLoading: false,
  errors: {}
}

describe('app reducer', () => {

  it('should return the initial state', () => {
    expect(appReducer(undefined, {})). toEqual(initialState)
  })

  it('should return existing state', () => {
    const someState = {token: '12345', isLoading: false, test: 'test'}
    expect(appReducer(someState, {})).toEqual(someState)
  })

  describe('Login actions', () => {
    it('should set isLoading', () => {
      expect(appReducer(undefined, {type: 'LOGIN'})).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return token if successful', () => {
      const token = 'testrandomtokenstring'
      const action = {
        type: 'LOGIN_SUCCESSFUL',
        payload: {
          token
        }
      }
      expect(appReducer(undefined, action)).toEqual({
        ...initialState, token
      })
    })

    it('should return errors if failed', () => {
      const errors = {someError: 'something went wrong'}
      const action = {
        type: 'LOGIN_FAILED',
        payload: errors
      }
      expect(appReducer(undefined, action)).toEqual({
        ...initialState, errors
      })

    })
  })

  describe('Register Actions', () => {
    it('should set isLoading', () => {
      expect(appReducer(undefined, {type: 'REGISTER'})).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return token if successful', () => {
      const token = 'testrandomtokenstring'
      const action = {
        type: 'REGISTER_SUCCESSFUL',
        payload: {
          token
        }
      }
      expect(appReducer(undefined, action)).toEqual({
        ...initialState, token
      })
    })

    it('should return errors if failed', () => {
      const errors = {someError: 'something went wrong'}
      const action = {
        type: 'REGISTER_FAILED',
        payload: errors
      }
      expect(appReducer(undefined, action)).toEqual({
        ...initialState, errors
      })
    })
  })
})

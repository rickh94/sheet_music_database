import appReducer from './app'

const initialState = {
  token: null,
  isLoading: false,
  errors: {}
}

describe('app reducer', () => {
  it('should return the initial state', () => {
    expect(appReducer(undefined, {})).toEqual(initialState)
  })

  it('should return existing state', () => {
    const someState = { token: '12345', isLoading: false, test: 'test' }
    expect(appReducer(someState, {})).toEqual(someState)
  })

  describe('Login actions', () => {
    it('should set isLoading', () => {
      expect(appReducer(undefined, { type: 'LOGIN' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return token and unset isLoading if successful', () => {
      const token = 'testrandomtokenstring'
      const action = {
        type: 'LOGIN_SUCCESSFUL',
        payload: {
          token
        }
      }
      expect(appReducer({ isLoading: true, ...initialState }, action)).toEqual({
        ...initialState,
        isLoading: false,
        token
      })
    })

    it('should return errors if failed', () => {
      const errors = { someError: 'something went wrong' }
      const action = {
        type: 'LOGIN_FAILED',
        payload: errors
      }
      expect(appReducer({ ...initialState, isLoading: true }, action)).toEqual({
        ...initialState,
        isLoading: false,
        errors
      })
    })
  })

  describe('Register Actions', () => {
    it('should set isLoading', () => {
      expect(appReducer(undefined, { type: 'REGISTER' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return token and unset isLoading if successful', () => {
      const token = 'testrandomtokenstring'
      const action = {
        type: 'REGISTER_SUCCESSFUL',
        payload: {
          token
        }
      }
      expect(appReducer({ ...initialState, isLoading: true }, action)).toEqual({
        ...initialState,
        isLoading: false,
        token
      })
    })

    it('should return errors and unset isLoading if failed', () => {
      const errors = { someError: 'something went wrong' }
      const action = {
        type: 'REGISTER_FAILED',
        payload: errors
      }
      expect(appReducer({ ...initialState, isLoading: true }, action)).toEqual({
        ...initialState,
        isLoading: false,
        errors
      })
    })
  })
  describe('Logout actions', () => {
    it('should set isLoading', () => {
      expect(appReducer(undefined, { type: 'LOGOUT' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should delete token and unset isLoading if successful', () => {
      expect(
        appReducer(
          { token: 'sometokentext', isLoading: true },
          { type: 'LOGOUT_SUCCESSFUL' }
        )
      ).toEqual({
        isLoading: false,
        token: null
      })
    })

    it('should not delete token, unset isLoading, and return errors if failed', () => {
      const state = { token: 'sometokentext', isLoading: true }
      const someError = 'some error text'
      expect(
        appReducer(state, { type: 'LOGOUT_FAILED', payload: { someError } })
      ).toEqual({
        ...state,
        isLoading: false,
        errors: { someError }
      })
    })
  })
})

import accountReducer from './account'

const initialState = {
  token: null,
  isLoading: false,
  errors: {}
}

describe('account reducer', () => {
  it('should return the initial state', () => {
    expect(accountReducer(undefined, {})).toEqual(initialState)
  })

  it('should return existing state', () => {
    const someState = { token: '12345', isLoading: false, test: 'test' }
    expect(accountReducer(someState, {})).toEqual(someState)
  })

  describe('Login actions', () => {
    it('should set isLoading', () => {
      expect(accountReducer(undefined, { type: 'LOGIN' })).toEqual({
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
      expect(accountReducer({ isLoading: true, ...initialState }, action)).toEqual({
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
      expect(accountReducer({ ...initialState, isLoading: true }, action)).toEqual({
        ...initialState,
        isLoading: false,
        errors
      })
    })
  })

  describe('Register Actions', () => {
    it('should set isLoading', () => {
      expect(accountReducer(undefined, { type: 'REGISTER' })).toEqual({
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
      expect(accountReducer({ ...initialState, isLoading: true }, action)).toEqual({
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
      expect(accountReducer({ ...initialState, isLoading: true }, action)).toEqual({
        ...initialState,
        isLoading: false,
        errors
      })
    })
  })
  describe('Logout actions', () => {
    it('should set isLoading', () => {
      expect(accountReducer(undefined, { type: 'LOGOUT' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should delete token and unset isLoading if successful', () => {
      expect(
        accountReducer(
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
        accountReducer(state, { type: 'LOGOUT_FAILED', payload: { someError } })
      ).toEqual({
        ...state,
        isLoading: false,
        errors: { someError }
      })
    })
  })

  describe('Profile Actions', () => {
    const profile = {
      email: 'test@test.test',
      firstName: 'test',
      lastName: 'test',
      username: 'test'
    }

    it('should set isLoading', () => {
      expect(accountReducer(undefined, { type: 'PROFILE' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should unset isLoading and return the data on success', () => {
      expect(
        accountReducer(
          { ...initialState, isLoading: true },
          { type: 'PROFILE_GET_SUCCESSFUL', payload: profile }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        profile
      })
    })

    it('should unset isLoading and return the errors on failure', () => {
      const errors = { someError: 'the error' }
      expect(
        accountReducer(undefined, { type: 'PROFILE_GET_FAILED', payload: errors })
      ).toEqual({ ...initialState, isLoading: false, errors })
    })

    it('should unset is loading and return the data', () => {
      expect(accountReducer({...initialState, isLoading: true}, {type: 'PROFILE_UPDATE_SUCCESSFUL', payload: profile})).toEqual({
        ...initialState, isLoading: false, profile
      })
    })
    
    it('should unset isLoading and return the errors on failure', () => {
      const errors = { someError: 'the error' }
      expect(
        accountReducer(undefined, { type: 'PROFILE_UPDATE_FAILED', payload: errors })
      ).toEqual({ ...initialState, isLoading: false, errors })
    })
  })
})

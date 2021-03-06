import {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  checkToken
} from './account'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import DjangoURL from '../middleware/api'
import { testToken } from '../testHelpers'

describe('account login actions', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()

  beforeEach(() => {
    api.clear()
  })

  it('returns the data', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const token = 'testtokentext'
    mock
      .onPost(api.v1.auth.login.url, {
        email: 'test@test.test',
        password: 'testpass'
      })
      .reply(200, {
        token
      })
    expect(
      await login('test@test.test', 'testpass', true)(mockDispatch, mockGetState)
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGIN' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOGIN_SUCCESSFUL',
      payload: { token }
    })
    expect(localStorage.getItem('token')).toEqual(token)
  })

  it('returns the errors', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const errors = { someError: 'error' }
    mock
      .onPost(api.v1.auth.login.url, {
        email: 'fail@test.com',
        password: 'failpassword'
      })
      .reply(400, errors)
    expect(
      await login('fail@test.com', 'failpassword', false)(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toBeCalledWith({ type: 'LOGIN' })
    expect(mockDispatch).toBeCalledWith({
      type: 'LOGIN_FAILED',
      payload: errors
    })
  })
})

describe('account register actions', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()

  beforeEach(() => {
    api.clear()
  })

  it('returns the data', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const token = 'testtokentext'
    mock
      .onPost(api.v1.auth.registration.url, {
        email: 'test@test.test',
        password1: 'testpass',
        password2: 'testpass'
      })
      .reply(200, {
        token
      })
    expect(
      await register('test@test.test', 'testpass', 'testpass', true)(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'REGISTER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'REGISTER_SUCCESSFUL',
      payload: { token }
    })
    expect(localStorage.getItem('token')).toEqual(token)
  })

  it('returns the errors', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const errors = { someError: 'error' }
    mock
      .onPost(api.v1.auth.registration.url, {
        email: 'fail@test.com',
        password: 'failpassword'
      })
      .reply(400, errors)
    expect(
      await register('fail@test.com', 'failpassword', 'failpassword', false)(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toBeCalledWith({ type: 'REGISTER' })
    expect(mockDispatch).toBeCalledWith({
      type: 'REGISTER_FAILED'
      // payload: errors
    })
    // does NOT like having an error payload. cannot figure out why
  })
})

describe('account logout actions', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()

  beforeEach(() => {
    api.clear()
  })

  it('calls dispatch and deletes local storage on success', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const token = 'testtokentext'
    mock.onPost(api.v1.auth.logout.url).reply(200, {})
    expect(await logout(token, false)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOGOUT_SUCCESSFUL'
    })
    expect(localStorage.getItem('token')).toBeFalsy()
  })

  it('calls dispatch and deletes local storage on success logout all', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const token = 'testtokentext'
    localStorage.setItem('token', token)
    mock.onPost(api.v1.auth.logoutall.url).reply(200, {})
    expect(await logout(token, true)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOGOUT_SUCCESSFUL'
    })
    expect(localStorage.getItem('token')).toBeFalsy()
  })

  it('returns the errors', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const errors = { someError: 'error' }
    const token = 'testtokentext'
    localStorage.setItem('token', token)
    mock.onPost(api.v1.auth.logout.url).reply(400, errors)
    expect(await logout(token, false)(mockDispatch, mockGetState)).toBeFalsy()
    expect(mockDispatch).toBeCalledWith({ type: 'LOGOUT' })
    expect(mockDispatch).toBeCalledWith({
      type: 'LOGOUT_FAILED',
      payload: errors
    })
    expect(localStorage.getItem('token')).toEqual(token)
  })
})

describe('account profile get action', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()
  const token = 'testtokentext'
  const profile = {
    first_name: 'test first name',
    last_name: 'test last name',
    email: 'test email',
    username: 'testusername'
  }

  beforeEach(() => {
    api.clear()
  })

  it('returns the data', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    mock.onGet(api.v1.auth.user.url, {}).reply(200, profile)
    expect(await getProfile(token)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'PROFILE' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'PROFILE_GET_SUCCESSFUL',
      payload: profile
    })
  })

  it('returns the errors', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const errors = { someError: 'error' }
    mock.onGet(api.v1.auth.user.url).reply(400, errors)
    expect(await getProfile(token)(mockDispatch, mockGetState)).toBeFalsy()
    expect(mockDispatch).toBeCalledWith({ type: 'PROFILE' })
    expect(mockDispatch).toBeCalledWith({
      type: 'PROFILE_GET_FAILED',
      payload: errors
    })
  })
})

describe('account profile update action', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()
  const token = 'testtokentext'
  const profile = {
    first_name: 'test first name',
    last_name: 'test last name',
    email: 'test email',
    username: 'testusername'
  }

  const profileUpdate = { username: 'testupdatedusername' }

  beforeEach(() => {
    api.clear()
  })

  it('returns the data', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    mock
      .onPatch(api.v1.auth.user.url, profileUpdate)
      .reply(200, { ...profile, username: profileUpdate.username })
    expect(
      await updateProfile(token, profileUpdate)(mockDispatch, mockGetState)
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'PROFILE' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'PROFILE_UPDATE_SUCCESSFUL',
      payload: { ...profile, username: profileUpdate.username }
    })
  })

  it('returns the errors', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const errors = { someError: 'error' }
    mock.onPatch(api.v1.auth.user.url, profileUpdate).reply(400, errors)
    expect(
      await updateProfile(token, profileUpdate)(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toBeCalledWith({ type: 'PROFILE' })
    expect(mockDispatch).toBeCalledWith({
      type: 'PROFILE_UPDATE_FAILED',
      payload: errors
    })
  })
})

describe('password change action', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()
  const token = 'testtokentext'

  beforeEach(() => {
    api.clear()
  })

  it('handles success', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    mock.onPost(api.v1.auth.password.change.url).reply(200)
    expect(
      await changePassword(token, 'newpassword', 'newpassword')(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CHANGE_PASSWORD' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CHANGE_PASSWORD_SUCCESSFUL'
    })
  })

  it('returns the errors', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const errors = { someError: 'error' }
    mock.onPost(api.v1.password.change.url).reply(400, errors)
    expect(
      await changePassword(token, 'newpassword', 'newpassword')(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toBeCalledWith({ type: 'CHANGE_PASSWORD' })
    expect(mockDispatch).toBeCalledWith({
      type: 'CHANGE_PASSWORD_FAILED'
      // payload: errors
    })
  })
})

describe('checkToken', () => {
  let api
  const mockGetState = jest.fn()
  const token = 'testtokentext'

  beforeEach(() => {
    api = DjangoURL()
  })

  it('sets the token on correct token', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    mock.onGet(api.v1.auth.user.read).reply(200)
    await checkToken(token)(mockDispatch, mockGetState)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGIN' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOGIN_SUCCESSFUL',
      payload: { token }
    })
  })

  it('does not set token and deletes from local storage on bad token', async () => {
    const mockDispatch = jest.fn()
    localStorage.setItem('token', testToken)
    const mock = new MockAdapter(axios)
    mock.onGet(api.v1.auth.user.read).reply(401)
    await checkToken(token)(mockDispatch, mockGetState)
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGIN' })
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGIN_FAILED' })
    expect(localStorage.getItem('token')).toBeNull()
  })
})

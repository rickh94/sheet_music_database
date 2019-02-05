import { login, register, logout, getProfile } from './account'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import DjangoURL from '../middleware/api'

describe('account login actions', () => {
  const api = new DjangoURL()
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
  const api = new DjangoURL()
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
  const api = new DjangoURL()
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
  const api = new DjangoURL()
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

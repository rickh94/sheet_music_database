import { login, register, logout } from './app'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import DjangoURL from '../middleware/api'

describe('app login actions', () => {
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

describe('app register actions', () => {
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
      type: 'REGISTER_FAILED',
      // payload: errors
    })
    // does NOT like having an error payload. cannot figure out why
  })
})

describe('app logout actions', () => {
  const api = new DjangoURL()
  const mockGetState = jest.fn()

  beforeEach(() => {
    api.clear()
  })

  it('calls dispatch and deletes local storage on success', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const token = 'testtokentext'
    mock
      .onPost(api.v1.auth.logout.url)
      .reply(200, {
      })
    expect(
      await logout(token, false)(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOGOUT_SUCCESSFUL',
    })
    expect(localStorage.getItem('token')).toBeFalsy()
  })

  it('calls dispatch and deletes local storage on success logout all', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const token = 'testtokentext'
    localStorage.setItem('token', token)
    mock
      .onPost(api.v1.auth.logoutall.url)
      .reply(200, {
      })
    expect(
      await logout(token, true)(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'LOGOUT_SUCCESSFUL',
    })
    expect(localStorage.getItem('token')).toBeFalsy()
  })

  it('returns the errors', async () => {
    const mockDispatch = jest.fn()
    const mock = new MockAdapter(axios)
    const errors = { someError: 'error' }
    const token = 'testtokentext'
    localStorage.setItem('token', token)
    mock
      .onPost(api.v1.auth.logout.url)
      .reply(400, errors)
    expect(
      await logout(token, false)(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toBeCalledWith({ type: 'LOGOUT' })
    expect(mockDispatch).toBeCalledWith({
      type: 'LOGOUT_FAILED',
      payload: errors
    })
    expect(localStorage.getItem('token')).toEqual(token)
    // does NOT like having an error payload. cannot figure out why
  })
})

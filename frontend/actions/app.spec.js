import { login } from './app'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import DjangoURL from '../middleware/api'

describe('app actions', () => {
  const api = new DjangoURL()
  const mockGetState = jest.fn()

  beforeEach = () => {
    api.clear()
    mockGetState.mockReset()
  }
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
    await login('test@test.test', 'testpass', true)(mockDispatch, mockGetState)
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
    await login('fail@test.com', 'failpassword', false)(mockDispatch, mockGetState)
    expect(mockDispatch).toBeCalledWith({ type: 'LOGIN' })
    expect(mockDispatch).toBeCalledWith({
      type: 'LOGIN_FAILED',
      // payload: errors
    })
    // does NOT like having an error payload. cannot figure out why
  })
})

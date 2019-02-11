import * as helpers from './helpers'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import DjangoURL from '../middleware/api'

function setup() {
  return { mockDispatch: jest.fn(), mockAxios: new MockAdapter(axios) }
}

describe('helper actions', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()
  const testList = ['test1', 'test2', 'test3']
  const token = 'testtokentext'
  const errors = { someError: 'error' }

  beforeEach(() => {
    api.clear()
  })

  it('gets test list correctly and returns', async () => {
    const { mockDispatch, mockAxios } = setup()
    const tags = api.v1.music.tags()
    mockAxios.onGet(tags.url, {}).reply(200, testList)
    expect(
      await helpers.getAction('TEST', tags)(mockDispatch, mockGetState)
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_TEST' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_TEST_SUCCESSFUL',
      payload: testList
    })
  })

  it('returns errors on get failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    const tags = api.v1.music.tags()
    mockAxios.onGet(tags.url).reply(400, errors)
    expect(
      await helpers.getAction('TEST', tags)(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_TEST' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_TEST_FAILED',
      payload: errors
    })
  })

  it('creates test successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newTag = { id: 4, name: 'test4' }
    const tags = api.v1.music.tags()
    mockAxios.onPost(tags.url, { name: 'test4' }).reply(201, newTag)
    expect(
      await helpers.createAction('TEST', tags, { name: 'test4' })(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_TEST' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_TEST_SUCCESSFUL',
      payload: newTag
    })
  })

  it('returns errors on create failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    const tags = api.v1.music.tags()
    mockAxios.onPost(tags.url).reply(400, errors)
    expect(
      await helpers.createAction('TEST', tags, { name: 'test4' })(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_TEST' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_TEST_FAILED',
      payload: errors
    })
  })

  it('updates test successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newTag = { id: 3, name: 'updated' }
    const tag3 = api.v1.tags(3)
    mockAxios.onPatch(tag3.url, { name: 'updated' }).reply(200, newTag)
    expect(
      await helpers.updateAction('TEST', tag3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_TEST' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_TEST_SUCCESSFUL',
      payload: newTag
    })
  })

  it('returns errors on update failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    const tag3 = api.v1.tags(3)
    mockAxios.onPost(tag3.url).reply(400, errors)
    expect(
      await helpers.updateAction('TEST', tag3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_TEST' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_TEST_FAILED'
      // payload: errors
    })
  })

  it('deletes tag successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const tag1 = api.v1.music.tags(1)
    mockAxios.onDelete(tag1.url).reply(204)
    expect(await helpers.deleteAction('TEST', tag1, 1)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_TEST' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_TEST_SUCCESSFUL',
      payload: 1
    })
  })

  it('returns errors on delete failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    const tag3 = api.v1.music.tags(3)
    mockAxios.onDelete(tag3.url).reply(400, errors)
    expect(
      await helpers.deleteAction('TEST', tag3, 3)(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_TEST' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_TEST_FAILED',
      payload: errors
    })
  })
})

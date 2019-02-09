import * as tags from './tags'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import DjangoURL from '../middleware/api'

function setup() {
  return { mockDispatch: jest.fn(), mockAxios: new MockAdapter(axios) }
}

describe('tag actions', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()
  const tagList = ['tag1', 'tag2', 'tag3']
  const token = 'testtokentext'
  const errors = { someError: 'error' }

  beforeEach(() => {
    api.clear()
  })

  it('gets tags correctly and returns', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.tags().url, {}).reply(200, tagList)
    expect(await tags.getTags(token)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_TAGS' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_TAGS_SUCCESSFUL',
      payload: tagList
    })
  })

  it('returns errors on get failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.tags().url).reply(400, errors)
    expect(await tags.getTags(token)(mockDispatch, mockGetState)).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_TAGS' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_TAGS_FAILED',
      payload: errors
    })
  })

  it('creates tag successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newTag = { id: 4, name: 'tag4' }
    mockAxios.onPost(api.v1.music.tags().url, { name: 'tag4' }).reply(201, newTag)
    expect(await tags.createTag(token, 'tag4')(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_TAG' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_TAG_SUCCESSFUL',
      payload: newTag
    })
  })

  it('returns errors on create failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.tags().url).reply(400, errors)
    expect(await tags.createTag(token, 'tag4')(mockDispatch, mockGetState)).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_TAG' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_TAG_FAILED',
      payload: errors
    })
  })

  it('updates tag successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newTag = { id: 3, name: 'updated' }
    mockAxios.onPatch(api.v1.music.tags(3).url, { name: 'updated' }).reply(200, newTag)
    expect(
      await tags.updateTag(token, 3, 'updated')(mockDispatch, mockGetState)
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_TAG' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_TAG_SUCCESSFUL',
      payload: newTag
    })
  })

  it('returns errors on update failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.tags(3).url).reply(400, errors)
    expect(
      await tags.updateTag(token, 3, 'updated')(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_TAG' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_TAG_FAILED'
      // payload: errors
    })
  })

  it('deletes tag successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onDelete(api.v1.music.tags(1).url).reply(204)
    expect(await tags.deleteTag(token, 1)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_TAG' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_TAG_SUCCESSFUL',
      payload: 1
    })
  })

  it('returns errors on delete failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onDelete(api.v1.music.tags(3).url).reply(400, errors)
    expect(
      await tags.deleteTag(token, 3, 'deleted')(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_TAG' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_TAG_FAILED',
      payload: errors
    })
  })
})

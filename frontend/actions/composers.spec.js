import * as composers from './composers'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import DjangoURL from '../middleware/api'
import * as helpers from './helpers'

function setup() {
  return { mockDispatch: jest.fn(), mockAxios: new MockAdapter(axios) }
}

describe('composer actions', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()
  const composerList = ['composer1', 'composer2', 'composer3']
  const token = 'testtokentext'
  const errors = { someError: 'error' }

  beforeEach(() => {
    api.clear()
  })

  it('gets composers correctly and returns', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.composers().url, {}).reply(200, composerList)
    expect(await composers.getComposers(token)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_COMPOSERS' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_COMPOSERS_SUCCESSFUL',
      payload: composerList
    })
  })

  it('gets a composer correctly and returns', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.composers(1).url, {}).reply(200, composerList[0])
    expect(await composers.getComposer(token, 1)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_COMPOSER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_COMPOSER_SUCCESSFUL',
      payload: composerList[0]
    })
  })

  it('returns errors on get failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.composers().url).reply(400, errors)
    expect(await composers.getComposers(token)(mockDispatch, mockGetState)).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_COMPOSERS' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_COMPOSERS_FAILED',
      payload: errors
    })
  })

  it('creates composer successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newComposer = { id: 4, name: 'composer4' }
    mockAxios
      .onPost(api.v1.music.composers().url, { name: 'composer4' })
      .reply(201, newComposer)
    expect(
      await composers.createComposer(token, { name: 'composer4' })(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_COMPOSER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_COMPOSER_SUCCESSFUL',
      payload: newComposer
    })
  })

  it('returns errors on create failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.composers().url).reply(400, errors)
    expect(
      await composers.createComposer(token, { name: 'composer4' })(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_COMPOSER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_COMPOSER_FAILED',
      payload: errors
    })
  })

  it('creates a composer with dates', async () => {
    const { mockDispatch, mockAxios } = setup()
    const born = new Date(1800)
    const bornStr = `${born.getFullYear()}-${born.getMonth()}-${born.getDate()}`
    const died = new Date(1890)
    const diedStr = `${died.getFullYear()}-${died.getMonth()}-${died.getDate()}`
    const spy = jest.spyOn(helpers, 'createAction')
    const newComposer = { id: 4, name: 'composer4', born: bornStr, died: diedStr }
    mockAxios
      .onPost(api.v1.music.composers().url)
      .reply(201, { ...newComposer, born: bornStr, died: diedStr })
    expect(
      await composers.createComposer(token, { name: 'composer4', born, died })(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_COMPOSER' })
    expect(spy).toHaveBeenCalledWith('COMPOSER', expect.anything(), {
      name: 'composer4',
      born: bornStr,
      died: diedStr
    })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_COMPOSER_SUCCESSFUL',
      payload: { ...newComposer }
    })
  })

  it('updates composer successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newComposer = { id: 3, name: 'updated' }
    mockAxios
      .onPatch(api.v1.music.composers(3).url, { name: 'updated' })
      .reply(200, newComposer)
    expect(
      await composers.updateComposer(token, 3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_COMPOSER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_COMPOSER_SUCCESSFUL',
      payload: newComposer
    })
  })

  it('updates a single composer successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newComposer = { id: 3, name: 'updated' }
    mockAxios
      .onPatch(api.v1.music.composers(3).url, { name: 'updated' })
      .reply(200, newComposer)
    expect(
      await composers.updateSingleComposer(token, 3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_SINGLE_COMPOSER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SINGLE_COMPOSER_SUCCESSFUL',
      payload: newComposer
    })
  })

  it('returns errors on update failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.composers(3).url).reply(400, errors)
    expect(
      await composers.updateComposer(token, 3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_COMPOSER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_COMPOSER_FAILED'
      // payload: errors
    })
  })

  it('returns errors on single update failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.composers(3).url).reply(400, errors)
    expect(
      await composers.updateSingleComposer(token, 3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_SINGLE_COMPOSER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SINGLE_COMPOSER_FAILED'
      // payload: errors
    })
  })

  it('deletes composer successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onDelete(api.v1.music.composers(1).url).reply(204)
    expect(
      await composers.deleteComposer(token, 1)(mockDispatch, mockGetState)
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_COMPOSER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_COMPOSER_SUCCESSFUL',
      payload: 1
    })
  })

  it('returns errors on delete failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onDelete(api.v1.music.composers(3).url).reply(400, errors)
    expect(
      await composers.deleteComposer(token, 3, 'deleted')(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_COMPOSER' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_COMPOSER_FAILED',
      payload: errors
    })
  })
})

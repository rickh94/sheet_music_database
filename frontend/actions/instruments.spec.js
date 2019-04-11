import * as instruments from './instruments'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import DjangoURL from '../middleware/api'
import { testToken } from '../testHelpers'

function setup() {
  return { mockDispatch: jest.fn(), mockAxios: new MockAdapter(axios) }
}

describe('instrument actions', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()
  const instrumentList = ['violin', 'viola', 'violoncello']
  const errors = { someError: 'error' }

  beforeEach(() => api.clear())

  it('gets instruments correctly and returns', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.instruments().url, {}).reply(200, instrumentList)
    expect(
      await instruments.getInstruments(testToken)(mockDispatch, mockGetState)
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_INSTRUMENTS' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_INSTRUMENTS_SUCCESSFUL',
      payload: instrumentList
    })
  })

  it('returns errors on get failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.instruments().url).reply(400, errors)
    expect(await instruments.getInstruments(testToken)(mockDispatch, mockGetState)).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_INSTRUMENTS' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_INSTRUMENTS_FAILED',
      payload: errors
    })
  })

  it('creates instrument successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newInstrument = { id: 4, name: 'flute' }
    mockAxios.onPost(api.v1.music.instruments().url, { name: 'flute' }).reply(201, newInstrument)
    expect(await instruments.createInstrument(testToken, 'flute')(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_INSTRUMENT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_INSTRUMENT_SUCCESSFUL',
      payload: newInstrument
    })
  })

  it('returns errors on create failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.instruments().url).reply(400, errors)
    expect(await instruments.createInstrument(testToken, 'instrument4')(mockDispatch, mockGetState)).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_INSTRUMENT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_INSTRUMENT_FAILED',
      payload: errors
    })
  })


  it('updates instrument successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newInstrument = { id: 3, name: 'updated' }
    mockAxios.onPatch(api.v1.music.instruments(3).url, { name: 'updated' }).reply(200, newInstrument)
    expect(
      await instruments.updateInstrument(testToken, 3, 'updated')(mockDispatch, mockGetState)
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_INSTRUMENT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_INSTRUMENT_SUCCESSFUL',
      payload: newInstrument
    })
  })

  
  it('returns errors on update failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.instruments(3).url).reply(400, errors)
    expect(
      await instruments.updateInstrument(testToken, 3, 'updated')(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_INSTRUMENT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_INSTRUMENT_FAILED'
      // payload: errors
    })
  })

  it('deletes instrument successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onDelete(api.v1.music.instruments(1).url).reply(204)
    expect(await instruments.deleteInstrument(testToken, 1)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_INSTRUMENT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_INSTRUMENT_SUCCESSFUL',
      payload: 1
    })
  })

  it('returns errors on delete failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onDelete(api.v1.music.instruments(3).url).reply(400, errors)
    expect(
      await instruments.deleteInstrument(testToken, 3, 'deleted')(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_INSTRUMENT' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_INSTRUMENT_FAILED',
      payload: errors
    })
  })
})

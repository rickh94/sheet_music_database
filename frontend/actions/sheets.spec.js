import * as sheets from './sheets'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import DjangoURL from '../middleware/api'
import * as helpers from './helpers'
import { testToken } from '../testHelpers'

function setup() {
  return { mockDispatch: jest.fn(), mockAxios: new MockAdapter(axios) }
}

describe('sheet actions', () => {
  const api = DjangoURL()
  const mockGetState = jest.fn()
  const sheetList = ['sheet1', 'sheet2', 'sheet3', 'sheet4']
  const errors = { someError: 'error' }

  beforeEach(() => api.clear())

  it('gets sheets correctly and returns', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.sheets().url, {}).reply(200, sheetList)
    expect(await sheets.getSheets(testToken)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_SHEETS' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_SHEETS_SUCCESSFUL',
      payload: sheetList
    })
  })


  it('gets a sheet correctly and returns', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.sheets(1).url, {}).reply(200, sheetList[0])
    expect(await sheets.getSheet(testToken, 1)(mockDispatch, mockGetState)).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_SHEET' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_SHEET_SUCCESSFUL',
      payload: sheetList[0]
    })
  })

  it('returns errors on get failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onGet(api.v1.music.sheets().url).reply(400, errors)
    expect(await sheets.getSheets(testToken)(mockDispatch, mockGetState)).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'GET_SHEETS' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'GET_SHEETS_FAILED',
      payload: errors
    })
  })

  it('creates sheet successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newSheet = { id: 4, filename: 'sheet4' }
    const data = new FormData()
    data.append('name', newSheet.filename)
    mockAxios
      .onPost(api.v1.music.sheets().url, data)
      .reply(201, newSheet)
    expect(
      await sheets.createSheet(testToken, { filename: 'sheet4' })(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_SHEET' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_SHEET_SUCCESSFUL',
      payload: newSheet
    })
  })

  it('returns errors on create failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.sheets().url).reply(400, errors)
    expect(
      await sheets.createSheet(testToken, { name: 'sheet4' })(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CREATE_SHEET' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CREATE_SHEET_FAILED',
      payload: errors
    })
  })


  it('updates sheet successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newSheet = { id: 3, name: 'updated' }
    mockAxios
      .onPatch(api.v1.music.sheets(3).url, { name: 'updated' })
      .reply(200, newSheet)
    expect(
      await sheets.updateSheet(testToken, 3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_SHEET' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SHEET_SUCCESSFUL',
      payload: newSheet
    })
  })

  it('updates a single sheet successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    const newSheet = { id: 3, name: 'updated' }
    mockAxios
      .onPatch(api.v1.music.sheets(3).url, { name: 'updated' })
      .reply(200, newSheet)
    expect(
      await sheets.updateSingleSheet(testToken, 3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_SINGLE_SHEET' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SINGLE_SHEET_SUCCESSFUL',
      payload: newSheet
    })
  })

  it('returns errors on update failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.sheets(3).url).reply(400, errors)
    expect(
      await sheets.updateSheet(testToken, 3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_SHEET' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SHEET_FAILED'
      // payload: errors
    })
  })

  it('returns errors on single update failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onPost(api.v1.music.sheets(3).url).reply(400, errors)
    expect(
      await sheets.updateSingleSheet(testToken, 3, { name: 'updated' })(
        mockDispatch,
        mockGetState
      )
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPDATE_SINGLE_SHEET' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SINGLE_SHEET_FAILED'
      // payload: errors
    })
  })

  it('deletes sheet successfully', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onDelete(api.v1.music.sheets(1).url).reply(204)
    expect(
      await sheets.deleteSheet(testToken, 1)(mockDispatch, mockGetState)
    ).toBeTruthy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_SHEET' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_SHEET_SUCCESSFUL',
      payload: 1
    })
  })

  it('returns errors on delete failure', async () => {
    const { mockDispatch, mockAxios } = setup()
    mockAxios.onDelete(api.v1.music.sheets(3).url).reply(400, errors)
    expect(
      await sheets.deleteSheet(testToken, 3, 'deleted')(mockDispatch, mockGetState)
    ).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_SHEET' })
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_SHEET_FAILED',
      payload: errors
    })
  })
})

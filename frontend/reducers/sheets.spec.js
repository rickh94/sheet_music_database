import sheetReducer from './sheets'

describe('sheet reducer', () => {
  const errors = { someError: 'error' }
  const initialState = {
    list: [],
    isLoading: false,
    errors: {},
    sheet: {}
  }

  const sheetList = [
    {
      id: 1,
      filename: 'file_1.pdf',
      file_format: 'pdf',
      sheet_type: 'part',
      sheet_file: 'https://example.com/1234.pdf'
    },
    {
      id: 2,
      filename: 'file_2.pdf',
      file_format: 'pdf',
      sheet_type: 'part',
      sheet_file: 'https://example.com/5678.pdf'
    },
    {
      id: 3,
      filename: 'file_3.pdf',
      file_format: 'pdf',
      sheet_type: 'part',
      sheet_file: 'https://example.com/1324.pdf'
    }
  ]

  it('should return the initial state', () => {
    expect(sheetReducer(undefined, {})).toEqual(initialState)
  })

  it('should return existing state', () => {
    const someState = {list: sheetList, isLoading: false}
    expect(sheetReducer(someState, {})).toEqual(someState)
  })
})

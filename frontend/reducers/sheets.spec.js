import sheetReducer from './sheets'

const errors = { someError: 'error' }
const initialState = {
  list: [],
  isLoading: false,
  errors: {},
  sheet: {}
}

const sheets = [
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
describe('sheet reducer', () => {
  it('should return the initial state', () => {
    expect(sheetReducer(undefined, {})).toEqual(initialState)
  })

  it('should return existing state', () => {
    const someState = { list: sheets, isLoading: false }
    expect(sheetReducer(someState, {})).toEqual(someState)
  })

  describe('get actions', () => {
    describe('get multiple', () => {
      it('should set isLoading', () => {
        expect(sheetReducer(undefined, { type: 'GET_SHEETS' })).toEqual({
          ...initialState,
          isLoading: true
        })
      })

      describe('get single', () => {
        it('should return the sheet list and unset is loading if get successful', () => {
          expect(
            sheetReducer(
              { ...initialState, isLoading: true },
              { type: 'GET_SHEETS_SUCCESSFUL', payload: sheets }
            )
          ).toEqual({ ...initialState, isLoading: false, list: sheets })
        })

        it('should return the errors if get unsuccessful', () => {
          expect(
            sheetReducer(
              { ...initialState, isLoading: true },
              { type: 'GET_SHEETS_FAILED', payload: errors }
            )
          ).toEqual({ ...initialState, isLoading: false, errors })
        })
      })

      it('should set isLoading', () => {
        expect(sheetReducer(undefined, { type: 'GET_SHEET' })).toEqual({
          ...initialState,
          isLoading: true
        })
      })

      it('should return sheet and unset isLoading if get successful', () => {
        expect(
          sheetReducer(
            { ...initialState, isLoading: true },
            { type: 'GET_SHEET_SUCCESSFUL', payload: sheets[0] }
          )
        ).toEqual({ ...initialState, isLoading: false, sheet: sheets[0] })
      })

      it('should return errors if get unsuccessful', () => {
        expect(
          sheetReducer(
            { ...initialState, isLoading: true },
            { type: 'GET_SHEET_FAILED', payload: errors }
          )
        ).toEqual({ ...initialState, isLoading: false, errors })
      })
    })
  })

  describe('create actions', () => {
    it('sets isLoading on create sheet', () => {
      expect(sheetReducer(undefined, { type: 'CREATE_SHEET' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return new sheet list on create successful', () => {
      const newSheet = {
        id: 4,
        filename: 'newsheet.pdf',
        sheet_file: 'https://example.com/new.pdf'
      }
      const newSheets = sheets.concat([newSheet])
      expect(
        sheetReducer(
          { ...initialState, list: sheets, isLoading: true },
          { type: 'CREATE_SHEET_SUCCESSFUL', payload: newSheet }
        )
      ).toEqual({ ...initialState, isLoading: false, list: newSheets })
    })

    it('should return the errors on create failed', () => {
      expect(
        sheetReducer(
          { ...initialState, isLoading: true },
          { type: 'CREATE_SHEET_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })
  })

  describe('update actions', () => {
    it('sets isLoading on update sheet', () => {
      expect(sheetReducer(undefined, { type: 'UPDATE_SHEET' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('sets isLoading on update single sheet', () => {
      expect(sheetReducer(undefined, { type: 'UPDATE_SINGLE_SHEET' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return the new sheetlist on update successful', () => {
      const updatedSheet = { id: 3, filename: 'updated' }
      const updatedSheets = [sheets[0], sheets[1], { id: 3, filename: 'updated' }]
      expect(
        sheetReducer(
          { ...initialState, list: sheets, isLoading: true },
          { type: 'UPDATE_SHEET_SUCCESSFUL', payload: updatedSheet }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        list: updatedSheets
      })
    })

    it('should return the updated sheet on update successful', () => {
      const updatedSheet = { id: 3, name: 'updated' }
      expect(
        sheetReducer(
          { ...initialState, sheet: sheets[2], isLoading: true },
          { type: 'UPDATE_SINGLE_SHEET_SUCCESSFUL', payload: updatedSheet }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        sheet: updatedSheet
      })
    })

    it('should return the errors on update failed', () => {
      expect(
        sheetReducer(
          { ...initialState, isLoading: true },
          { type: 'UPDATE_SHEET_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })

    it('should return the errors on update failed', () => {
      expect(
        sheetReducer(
          { ...initialState, isLoading: true },
          { type: 'UPDATE_SINGLE_SHEET_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })
  })

  describe('delete actions', () => {
    it('sets isLoading on delete sheet', () => {
      expect(sheetReducer(undefined, { type: 'DELETE_SHEET' })).toEqual({
        ...initialState,
        isLoading: true
      })
    })

    it('should return the new sheetlist on delete successful', () => {
      const newSheets = [sheets[0], sheets[2]]
      expect(
        sheetReducer(
          { ...initialState, list: sheets, isLoading: true },
          { type: 'DELETE_SHEET_SUCCESSFUL', payload: 2 }
        )
      ).toEqual({
        ...initialState,
        isLoading: false,
        list: newSheets
      })
    })

    it('should return the errors on delete failed', () => {
      expect(
        sheetReducer(
          { ...initialState, isLoading: true },
          { type: 'DELETE_SHEET_FAILED', payload: errors }
        )
      ).toEqual({ ...initialState, isLoading: false, errors })
    })
  })
})

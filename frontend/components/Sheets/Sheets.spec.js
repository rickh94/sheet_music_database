import React from 'react'
import { shallow } from 'enzyme'
import '../../setupTests'
import { Sheets } from './Sheets'
import {
  testLoggedIn,
  testGetData,
  testGetDataFailed,
  testToken,
  clickButton
} from '../../testHelpers'

describe('<Sheets />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <Sheets
        sheets={{ list: [] }}
        alert={{ show: jest.fn() }}
        getSheets={jest.fn()}
        createSheet={jest.fn()}
        deleteSheet={jest.fn()}
        token={testToken}
        history={{ push: jest.fn() }}
      />
    )
  })
  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
  })

  it('renders a container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders sheets from props', () => {
    const sheets = {
      list: [
        {
          id: 1,
          filename: 'testfile.pdf',
          file_type: 'PDF',
          sheet_file: 'https://example.com/testfile.pdf'
        },
        {
          id: 2,
          filename: 'testfile.pdf',
          file_type: 'PDF',
          sheet_file: 'https://example.com/testfile.pdf'
        }
      ]
    }
    wrapper.setProps({ sheets })
    expect(wrapper.find('ListItem').length).toEqual(2)
  })

  it('redirects if not logged in', () => {
    testLoggedIn(wrapper)
  })

  it('gets sheets if logged in', () => {
    testGetData(wrapper, 'getSheets')
  })

  it('shows an error on get failure', () => {
    testGetDataFailed(wrapper, 'getSheets', 'Sheets')
  })

  it('renders a create button', () => {
    wrapper.find('#activate-create').simulate('click')
    expect(wrapper.state().createMode).toBeTruthy()
  })

  it('renders a modal to create new sheets', () => {
    expect(wrapper.exists('Modal')).toBeTruthy()
    expect(wrapper.find('Modal').contains('New Sheet')).toBeTruthy()
    expect(wrapper.find('Modal').exists('TextFieldWithErrors')).toBeTruthy()
    expect(wrapper.find('Modal').exists('FilePond')).toBeTruthy()
  })

  it('has a button to save created sheet and resets state', () => {
    const createSheet = jest.fn()
    const newSheetFilename = 'newsheet.pdf'
    const clearSpy = jest.spyOn(wrapper.instance(), 'clearForm')
    const handleSpy = jest.spyOn(wrapper.instance(), 'handleSubmit')
    wrapper.setProps({ createSheet })
    wrapper.setState({ newSheetFilename, createMode: true })
    clickButton(wrapper, 'Save')
    expect(handleSpy).toHaveBeenCalled()
  })

  it('has a cancel button that closes the modal and resets the form', () => {
    const spy = jest.spyOn(wrapper.instance(), 'clearForm')
    wrapper.setState({ createMode: true, newSheetFilename: 'test' })
    clickButton(wrapper, 'Cancel')
    expect(spy).toHaveBeenCalled()
  })

  describe('clearForm', () => {
    it('clears the form state', () => {
      wrapper.setState({
        newSheetFilename: 'test',
        newSheetFormat: 'PDF',
        newSheetType: 'score',
        newSheetFile: 'test file'
      })
      wrapper.instance().clearForm()
      expect(wrapper.state().newSheetFilename).toEqual('')
      expect(wrapper.state().newSheetFormat).toEqual('')
      expect(wrapper.state().newSheetType).toEqual('')
      expect(wrapper.state().newSheetFile).toBeNull()
    })
  })
  describe('handle submit', () => {
    it('returns and sets errors if no filename', () => {
      const createSheet = jest.fn()
      wrapper.setProps({ createSheet })
      wrapper.setState({ newSheetFilename: '' })
      wrapper.instance().handleSubmit()
      expect(createSheet).not.toHaveBeenCalled()
      expect(wrapper.state().errors.filename).toEqual('File name is required')
    })

    it('returns and sets errors if no file', () => {
      const createSheet = jest.fn()
      const show = jest.fn()
      wrapper.setProps({ createSheet, alert: { show } })
      wrapper.setState({ newSheetFile: null, newSheetFilename: 'test' })
      wrapper.instance().handleSubmit()
      expect(createSheet).not.toHaveBeenCalled()
      expect(wrapper.state().errors.sheet_file).toEqual('File is required')
    })

    it('calls create sheet and clears form on success', () => {
      const createSheet = jest.fn()
      const show = jest.fn()
      createSheet.mockReturnValue(true)
      const spy = jest.spyOn(wrapper.instance(), 'clearForm')
      wrapper.setProps({ createSheet, alert: {show} })
      wrapper.setState({
        newSheetFilename: 'testname',
        newSheetFormat: 'testformat',
        newSheetType: 'testtype',
        newSheetFile: 'testfile'
      })
      wrapper.instance().handleSubmit()
      expect(createSheet).toHaveBeenCalledWith(testToken, {
        filename: 'testname',
        file_format: 'testformat',
        sheet_type: 'testtype',
        sheet_file: 'testfile'
      })
      expect(show).toHaveBeenCalledWith(
        <span className="alert-text">Sheet Created</span>
      )
      expect(spy).toHaveBeenCalled()
    })

    it('sets errors and shows alert on failure', () => {
      const createSheet = jest.fn()
      const show = jest.fn()
      createSheet.mockReturnValue(false)
      const spy = jest.spyOn(wrapper.instance(), 'clearForm')
      wrapper.setProps({ createSheet, alert: {show}, sheets: {errors: {filename: 'test error'}, list: []} })
      wrapper.setState({
        newSheetFilename: 'testname',
        newSheetFormat: 'testformat',
        newSheetType: 'testtype',
        newSheetFile: 'testfile'
      })
      wrapper.instance().handleSubmit()
      expect(createSheet).toHaveBeenCalledWith(testToken, {
        filename: 'testname',
        file_format: 'testformat',
        sheet_type: 'testtype',
        sheet_file: 'testfile'
      })
      expect(show).toHaveBeenCalledWith(
        <span className="alert-text">Sheet Creation Failed</span>
      )
      expect(spy).not.toHaveBeenCalled()
      expect(wrapper.state().errors.filename).toEqual('test error')
    })
  })
})

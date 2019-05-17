import React from 'react'
import { shallow } from 'enzyme'
import '../../setupTests'

import {
  testToken,
  testLoggedIn,
  testGetData,
  testGetDataFailed,
  clickButton
} from '../../testHelpers'

import { Sheet } from './Sheet'

describe('Sheet', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <Sheet
        alert={{ show: jest.fn() }}
        getSheet={jest.fn()}
        updateSingleSheet={jest.fn()}
        token={testToken}
        match={{ params: { id: 1 } }}
        sheets={{ sheet: {} }}
        history={{ push: jest.fn() }}
      />
    )
  })

  it('matches the snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
  })

  it('renders a container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders a sheet from props', () => {
    const sheet = {
      filename: 'testname.pdf',
      file_format: 'PDF',
      sheet_type: 'score',
      sheet_file: 'https://example.com'
    }
    wrapper.setProps({ sheet })
    expect(wrapper.find('FieldDisplay').length).toEqual(2)
    expect(wrapper.contains(sheet.filename))
  })

  it('renders a download button', () => {
    expect(wrapper.contains('Download File')).toBeTruthy()
  })

  it('renders a filepond when in change file mode', () => {
    wrapper.setState({changeFileMode: true})
    expect(wrapper.exists('FilePond')).toBeTruthy()
  })

  it('switches to change file mode when change file is clicked', () => {
    clickButton(wrapper, 'Change File')
    expect(wrapper.state().changeFileMode).toBeTruthy()
  })

  it('redirects if not logged in', () => {
    testLoggedIn(wrapper)
  })

  it('gets the sheet', () => {
    testGetData(wrapper, 'getSheet', [1])
  })

  it('shows error on get failure', () => {
    testGetDataFailed(wrapper, 'getSheet', 'Sheet')
  })

  it('calls updateSingleSheet with updated data', () => {
    const updateSingleSheet = jest.fn()
    wrapper.setProps({ token: 'testtoken', updateSingleSheet })
    wrapper.instance().updateFields({'test': 'newValue'})
    expect(updateSingleSheet).toHaveBeenCalledWith('testtoken', 1, { test: 'newValue' })
  })

  it('sets errors in state on error', async () => {
    const updateSingleSheet = (token, id, updated) => false
    const errors = { name: 'invalid name' }
    wrapper.setProps({ updateSingleSheet, sheets: { errors, sheet: {} } })
    await wrapper.instance().updateFields({'test': 'test'})
    expect(wrapper.state().errors).toEqual(errors)
  })

  it('helper function calls updateFields correctly', () => {
    const spy = jest.spyOn(wrapper.instance(), 'updateFields')
    wrapper.instance().updateFromFieldDisplay('testkey', 'testvalue')
    expect(spy).toHaveBeenCalledWith({'testkey': 'testvalue'})
  })
})

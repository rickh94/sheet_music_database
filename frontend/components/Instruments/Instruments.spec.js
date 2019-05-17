import React from 'react'
import { shallow } from 'enzyme'
import { Instruments } from './Instruments'
import '../../setupTests'
import {
  testToken,
  testLoggedIn,
  testGetData,
  testGetDataFailed,
  clickButton
} from '../../testHelpers'

describe('<Instruments />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <Instruments
        history={{ push: jest.fn() }}
        token={testToken}
        alert={{ show: jest.fn() }}
        getInstruments={jest.fn()}
        createInstrument={jest.fn()}
        deleteInstrument={jest.fn()}
        updateInstrument={jest.fn()}
        instruments={{ list: [] }}
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

  it('renders the instruments from the list', () => {
    const instruments = { list: [{ id: 1, name: 'violin' }, { id: 2, name: 'viola' }] }
    wrapper.setProps({ instruments })
    expect(wrapper.find('ListItem').length).toEqual(2)
  })

  it('redirects if not logged in', () => {
    testLoggedIn(wrapper)
  })

  it('gets instruments if logged in', () => {
    testGetData(wrapper, 'getInstruments')
  })

  it('shows an error on get failure', () => {
    testGetDataFailed(wrapper, 'getInstruments', 'Instruments')
  })

  it('renders a create button', () => {
    wrapper.find('#activate-create').simulate('click')
    expect(wrapper.state().createMode).toBeTruthy()
  })

  it('renders a modal to create new instruments', () => {
    expect(wrapper.exists('Modal')).toBeTruthy()
    expect(wrapper.find('Modal').contains('New Instrument')).toBeTruthy()
    expect(wrapper.find('Modal').exists('TextFieldWithErrors')).toBeTruthy()
  })

  it('has a button to save created instrument, and resets state', () => {
    const createInstrument = jest.fn()
    const newInstrumentName = 'new test instrument name'
    const spy = jest.spyOn(wrapper.instance(), 'handleSubmit')
    wrapper.setProps({ createInstrument })
    wrapper.setState({ newInstrumentName, createMode: true })
    clickButton(wrapper, 'Save')
    expect(spy).toHaveBeenCalled()
  })

  it('has a cancel button that closes the modal and reset newinstrumentname', () => {
    wrapper.setState({ createMode: true, newInstrumentName: 'test instrument name' })
    clickButton(wrapper, 'Cancel')
    expect(wrapper.state().createMode).toBeFalsy()
    expect(wrapper.state().newInstrumentName).toEqual('')
  })

  describe('handle submit', () => {
    const e = { preventDefault: jest.fn() }
    it('returns and sets errors if no name', async () => {
      const createInstrument = jest.fn()
      wrapper.setProps({ createInstrument })
      wrapper.setState({ newInstrumentName: '', createMode: true })
      await wrapper.instance().handleSubmit(e)
      expect(createInstrument).not.toHaveBeenCalled()
      expect(wrapper.state().errors.name).toEqual('Instrument name is required')
      expect(wrapper.state().createMode).toBeTruthy()
    })

    it('calls create instrument and clears form on success', async () => {
      const createInstrument = jest.fn()
      const show = jest.fn()
      createInstrument.mockReturnValue(true)
      wrapper.setProps({ createInstrument, alert: { show } })
      wrapper.setState({
        newInstrumentName: 'testname', createMode: true
      })
      await wrapper.instance().handleSubmit(e)
      expect(createInstrument).toHaveBeenCalledWith(testToken, 'testname')
      expect(show).toHaveBeenCalledWith(<span className="alert-text">Instrument Created</span>)
      expect(wrapper.state().newInstrumentName).toEqual('')
    })

    it('sets errors and shows alert on failure', async () => {
      const createInstrument = jest.fn()
      const show = jest.fn()
      createInstrument.mockReturnValue(false)
      wrapper.setProps({
        createInstrument,
        alert: { show },
        instruments: { errors: { name: 'test error' }, list: [] }
      })
      wrapper.setState({
        newInstrumentName: 'testname', createMode: true
      })
      await wrapper.instance().handleSubmit(e)
      expect(createInstrument).toHaveBeenCalledWith(testToken, 'testname')
      expect(show).toHaveBeenCalledWith(
        <span className="alert-text">Instrument Creation Failed</span>,
        { type: 'error' }
      )
      expect(wrapper.state().errors.name).toEqual('test error')
      expect(wrapper.state().createMode).toBeTruthy()
    })
  })
})

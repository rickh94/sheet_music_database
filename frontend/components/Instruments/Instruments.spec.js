import React from 'react'
import { shallow } from 'enzyme'
import { Instruments } from './Instruments'
import '../../setupTests'
import { testToken } from '../../testHelpers'

describe('<Instruments />', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <Instruments
        history={{ push: jest.fn() }}
        token={testToken}
        alert={{ list: [] }}
        getInstruments={jest.fn()}
        createInstrument={jest.fn()}
        deleteInstrument={jest.fn()}
        updateInstrument={jest.fn()}
      />
    )
  })

  it('matches the snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
  })

  it('renders the instruments from the list', () => {
    const instruments = {list: [{id: 1, name: 'violin'}, {id: 2, name: 'viola'}]}
    wrapper.setProps({instruments})
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import TextFieldWithErrors from './TextFieldWithErrors'

import '../../setupTests'

describe('<TextFieldWithErrors />', () => {
  const wrapper = shallow(
    <TextFieldWithErrors
      label="Test"
      type="text"
      value="test"
      onChange={jest.fn()}
      error={null}
      name="test"
    />
  )

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a control', () => {
    expect(wrapper.exists('Control')).toBeTruthy()
  })

  it('renders an input', () => {
    expect(wrapper.exists('Label')).toBeTruthy()
    expect(wrapper.find('Label').contains('Test'))
  })

  it('renders a Field', () => {
    expect(wrapper.exists('Field')).toBeTruthy()
  })

  it('renders errors', () => {
    const error = 'test error'
    wrapper.setProps({ error })
    expect(wrapper.exists('Help')).toBeTruthy()
    expect(wrapper.find('Help').contains(error)).toBeTruthy()
  })

  it('calls onChange callback when a change occurs', () => {
    const onChange = jest.fn()
    wrapper.setProps({ onChange })
    wrapper.find('Input').simulate('change', { target: 'testvalue' })
    expect(onChange).toHaveBeenCalled()
  })

  it('does not render label if not provided', () => {
    wrapper.setProps({label: null})
    expect(wrapper.exists('Label')).toBeFalsy()
  })
})

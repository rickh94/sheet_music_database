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

  it('calls onChange callback when a change occurs', () => {
    const onChange = jest.fn()
    wrapper.setProps({ onChange })
    wrapper.find('Input').simulate('change', { target: 'testvalue' })
    expect(onChange).toHaveBeenCalled()
  })

  it('renders a field with errors', () => {
    expect(wrapper.exists('FieldWithErrors')).toBeTruthy()
    const label = 'Test Label'
    const error = { test: 'someError' }
    const className = 'test-class'
    wrapper.setProps({ label, error, className })
    const fieldWithErrors = wrapper.find('FieldWithErrors')
    expect(fieldWithErrors.props().label).toEqual(label)
    expect(fieldWithErrors.props().error).toEqual(error)
    expect(fieldWithErrors.props().className).toEqual(className)
  })
})

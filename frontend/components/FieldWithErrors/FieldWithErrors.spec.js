import React from 'react'
import { shallow, mount } from 'enzyme'
import FieldWithErrors from './FieldWithErrors'

import '../../setupTests'

describe('<FieldWithErrors />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FieldWithErrors />)
  })

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a Field and a Control', () => {
    expect(wrapper.exists('Field')).toBeTruthy()
    expect(wrapper.exists('Control')).toBeTruthy()
  })

  it('renders label from props', () => {
    const label = 'test label'
    wrapper.setProps({ label })
    expect(wrapper.exists('Label')).toBeTruthy()
    expect(wrapper.find('Label').contains(label)).toBeTruthy()
  })

  it('renders children', () => {
    const otherWrapper = shallow(
      <FieldWithErrors>
        <div>test</div>
      </FieldWithErrors>
    )
    expect(otherWrapper.exists('div')).toBeTruthy()
    expect(otherWrapper.find('div').contains('test')).toBeTruthy()
  })

  it('renders errors', () => {
    const error = 'test error'
    wrapper.setProps({error})
    expect(wrapper.exists('Help')).toBeTruthy()
    expect(wrapper.find('Help').contains(error)).toBeTruthy()
  })

  it('does not render label if not provided', () => {
    wrapper.setProps({label: null})
    expect(wrapper.exists('Label')).toBeFalsy()
  })
})

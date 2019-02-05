import React from 'react'
import { shallow } from 'enzyme'
import '../../setupTests'

import { Profile, FieldDisplay } from './Profile'

describe('Profile', () => {
  const wrapper = shallow(<Profile account={{ token: 'sometoken' }} />)
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a card', () => {
    expect(wrapper.exists('Card')).toBeTruthy()
  })

  it('renders a container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
  })

  it('renders a change password button', () => {
    expect(
      wrapper.findWhere(el => el.name() == 'Button' && el.contains('Change Password'))
    )
  })

  it('renders 4 FieldDisplays', () => {
    expect(wrapper.find('FieldDisplay').length).toEqual(4)

  })
})

describe('FieldDisplay', () => {
  const wrapper = shallow(<FieldDisplay label="" value="" saveCallback={jest.fn()} backendFieldName="test" />)

  it('renders the value in the text', () => {
    wrapper.setProps({ value: 'test' })
    expect(wrapper.contains('test')).toBeTruthy()
  })

  it('renders an edit link', () => {
    expect(wrapper.exists('.edit-link')).toBeTruthy()
  })

  it('renders label', () => {
    wrapper.setProps({ label: 'Test name' })
    expect(wrapper.contains('Test name')).toBeTruthy()
  })

  it('renders a div', () => {
    expect(wrapper.exists('div')).toBeTruthy()
  })

  it('renders a field and buttons when edit is true', () => {
    wrapper.setState({ edit: true })
    expect(wrapper.exists('TextFieldWithErrors')).toBeTruthy()
    expect(
      wrapper.findWhere(el => el.name() == 'Button' && el.contains('Save')).length
    ).toEqual(1)
    expect(
      wrapper.findWhere(el => el.name() == 'Button' && el.contains('Cancel')).length
    ).toEqual(1)
  })

  it('resets state when cancel is clicked', () => {
    const value = 'test value'
    wrapper.setProps({ value })
    wrapper.setState({ edit: true, newValue: 'test new value' })
    wrapper
      .findWhere(el => el.name() == 'Button' && el.contains('Cancel'))
      .simulate('click')
    expect(wrapper.state().edit).toBeFalsy()
    expect(wrapper.state().newValue).toEqual(value)
  })

  it('calls the save callback with new value when save is clicked and resets state', () => {
    const newValue = 'test new value'
    const backendFieldName = 'backend_field'
    const saveCallback = jest.fn()
    wrapper.setProps({ saveCallback, backendFieldName })
    wrapper.setState({ edit: true, newValue })
    wrapper.findWhere(el => el.name() == 'Button' && el.contains('Save')).simulate('click')
    expect(saveCallback).toHaveBeenCalledWith(backendFieldName, newValue)
    expect(wrapper.state().edit).toBeFalsy()
  })
})

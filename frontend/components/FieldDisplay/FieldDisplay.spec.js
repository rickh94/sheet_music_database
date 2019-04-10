import React from 'react'
import { shallow } from 'enzyme'
import FieldDisplay from './FieldDisplay'

import '../../setupTests'

describe('FieldDisplay', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <FieldDisplay
        label=""
        value=""
        saveCallback={jest.fn()}
        backendFieldName="test"
      />
    )
  })

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
    wrapper
      .findWhere(el => el.name() == 'Button' && el.contains('Save'))
      .simulate('click')
    expect(saveCallback).toHaveBeenCalledWith(backendFieldName, newValue)
    expect(wrapper.state().edit).toBeFalsy()
  })

  it('renders a link if linkTo prop is set', () => {
    wrapper.setProps({ linkTo: '/test/location' })
    expect(wrapper.exists('Link')).toBeTruthy()
    expect(wrapper.find('Link').props().to).toEqual('/test/location')
  })

  it('renders a date picker in edit if type is date', () => {
    wrapper.setProps({ type: 'date', value: '2018-01-01' })
    wrapper.setState({ edit: true })
    expect(wrapper.exists('DatePicker')).toBeTruthy()
  })

  it('shows the date nicely', () => {
    wrapper.setProps({ type: 'date', value: '2018-01-01' })
    expect(wrapper.contains('January 1, 2018')).toBeTruthy()
  })
})

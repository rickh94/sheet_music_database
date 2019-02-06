import React from 'react'
import { shallow } from 'enzyme'
import '../../setupTests'

import { Profile, FieldDisplay } from './Profile'

describe('Profile', () => {
  const defaultProfile = { first_name: '', last_name: '', username: '', email: '' }

  const wrapper = shallow(
    <Profile
      account={{
        token: 'sometoken',
        profile: defaultProfile
      }}
      history={{ goBack: jest.fn(), push: jest.fn() }}
      getProfile={jest.fn()}
      updateProfile={jest.fn()}
      alert={{ show: jest.fn() }}
    />
  )
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

  it('renders 3 FieldDisplays', () => {
    expect(wrapper.find('FieldDisplay').length).toEqual(3)
  })

  it('renders email without edit option', () => {
    expect(wrapper.contains('Email:')).toBeTruthy()
  })

  it('redirects if user is not logged in', async () => {
    const history = { push: jest.fn() , goBack: jest.fn()}
    const alert = { show: jest.fn() }
    wrapper.setProps({
      account: { token: null, profile: defaultProfile },
      history,
      alert
    })
    await wrapper.instance().componentDidMount()
    expect(history.push).toHaveBeenCalledWith('/login')
    expect(alert.show).toHaveBeenCalledWith(
      <span className="alert-text">Please log in</span>,
      { type: 'error' }
    )
  })

  it('downloads profile information', async () => {
    const getProfile = jest.fn()
    const token = 'sometesttoken'
    wrapper.setProps({ getProfile, account: { token, profile: defaultProfile } })
    await wrapper.instance().componentDidMount()
    expect(getProfile).toHaveBeenCalledWith(token)
  })

  it('updates profile information', async () => {
    const updateProfile = jest.fn()
    const token = 'sometesttoken'
    const updateData =  'new test username'
    wrapper.setProps({ updateProfile, account: { token, profile: defaultProfile } })
    await wrapper.instance().updateField('username', updateData)
    expect(updateProfile).toHaveBeenCalledWith(token, {username: updateData})
  })
})

describe('FieldDisplay', () => {
  const wrapper = shallow(
    <FieldDisplay label="" value="" saveCallback={jest.fn()} backendFieldName="test" />
  )

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
})

import React from 'react'
import { shallow } from 'enzyme'
import '../../setupTests'

import { Profile, PasswordChangeForm } from './Profile'

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
      changePassword={jest.fn()}
    />
  )

  beforeEach(() => {
    wrapper.update()
  })

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
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
    expect(wrapper.contains('Email')).toBeTruthy()
  })

  it('redirects if user is not logged in', async () => {
    const history = { push: jest.fn(), goBack: jest.fn() }
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
    const updateData = 'new test username'
    wrapper.setProps({ updateProfile, account: { token, profile: defaultProfile } })
    await wrapper.instance().updateField('username', updateData)
    expect(updateProfile).toHaveBeenCalledWith(token, { username: updateData })
  })

  it('calls an alert on profile update success', async () => {
    const updateProfile = () => Promise.resolve(true)
    const alert = { show: jest.fn() }
    wrapper.setProps({ alert, updateProfile })
    await wrapper.instance().updateField('test', 'test')
    expect(alert.show).toHaveBeenCalledWith(
      <span className="alert-text">Profile Updated</span>,
      { type: 'success' }
    )
  })

  it('calls an alert on profile update failure', async () => {
    const updateProfile = () => Promise.resolve(false)
    const alert = { show: jest.fn() }
    wrapper.setProps({ alert, updateProfile })
    await wrapper.instance().updateField('test1', 'test1')
    expect(alert.show).toHaveBeenCalledWith(
      <span className="alert-text">Could not save profile information</span>,
      { type: 'error' }
    )
  })

  it('renders the password change modal when change password is clicked', () => {
    expect(wrapper.state().changePasswordOpen).toBeFalsy()
    wrapper.find('Button').simulate('click')
    expect(wrapper.state().changePasswordOpen).toBeTruthy()
  })

  it('calls change password correctly', async () => {
    const changePassword = jest.fn()
    const token = 'testtoken'
    const [password1, password2] = ['test', 'test']
    wrapper.setProps({ changePassword, account: { token, profile: defaultProfile } })
    await wrapper.instance().changePassword(password1, password2)
    expect(changePassword).toHaveBeenCalledWith(token, password1, password2)
  })

  it('does not call password change if passwords are different and sets error', async () => {
    const changePassword = jest.fn()
    wrapper.setProps({ changePassword })
    await wrapper.instance().changePassword('test', 'test1')
    expect(changePassword).not.toHaveBeenCalled()
  })

  it('shows an alert on successful password change and closes modal', async () => {
    const changePassword = () => Promise.resolve(true)
    const alert = { show: jest.fn() }
    wrapper.setProps({ changePassword, alert })
    wrapper.setState({ changePasswordOpen: true })
    await wrapper.instance().changePassword('test', 'test')
    expect(alert.show).toHaveBeenCalledWith(
      <span className="alert-text">Password Changed</span>,
      { type: 'success' }
    )
    expect(wrapper.state().changePasswordOpen).toBeFalsy()
  })

  it('shows an alert on failed password change and does not close modal', async () => {
    const changePassword = () => Promise.resolve(false)
    const alert = { show: jest.fn() }
    wrapper.setProps({ changePassword, alert })
    wrapper.setState({ changePasswordOpen: true })
    await wrapper.instance().changePassword('test', 'test')
    expect(alert.show).toHaveBeenCalledWith(
      <span className="alert-text">Password Change Failed</span>,
      { type: 'error' }
    )
    expect(wrapper.state().changePasswordOpen).toBeTruthy()
  })
})


describe('Password Change Modal', () => {
  const wrapper = shallow(
    <PasswordChangeForm errors={{}} onSubmit={jest.fn()} onCancel={jest.fn()} />
  )

  beforeEach(() => {
    wrapper.update()
  })

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the title', () => {
    expect(wrapper.contains('Change Password')).toBeTruthy()
  })

  it('renders a form', () => {
    expect(wrapper.exists('form')).toBeTruthy()
  })

  it('renders two text field with errors', () => {
    expect(wrapper.find('TextFieldWithErrors').length).toEqual(2)
  })

  it('renders buttons', () => {
    expect(wrapper.find('Button').length).toEqual(2)
  })

  it('calls passed in function on submit clicked', () => {
    const onSubmit = jest.fn()
    const [password1, password2] = ['test', 'test']
    wrapper.setProps({ onSubmit })
    wrapper.setState({ password1, password2 })
    wrapper.find('TextFieldWithErrors').forEach(field => {
      field.simulate('change', { target: { value: 'test' } })
    })
    wrapper
      .findWhere(el => el.name() == 'Button' && el.contains('Submit'))
      .simulate('click', { preventDefault: jest.fn() })
    expect(onSubmit).toHaveBeenCalledWith(password1, password2)
  })

  it('calls passed in function on cancel clicked', () => {
    const onCancel = jest.fn()
    wrapper.setProps({ onCancel })
    wrapper
      .findWhere(el => el.name() == 'Button' && el.contains('Cancel'))
      .simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })
})

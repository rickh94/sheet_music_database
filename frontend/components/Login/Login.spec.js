import { shallow } from 'enzyme'
import React from 'react'
import '../../setupTests'
import Login, { LoginForm } from './Login'

import { Label } from 'react-bulma-components/lib/components/form'

describe('Login', () => {
  const wrapper = shallow(<Login />)

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders the Header', () => {
    expect(wrapper.exists('Header')).toBeTruthy()
  })

  it('renders a LoginForm', () => {
    expect(wrapper.exists('LoginForm')).toBeTruthy()
  })
})

describe('LoginForm', () => {
  const wrapper = shallow(<LoginForm />)

  beforeEach(() => {
    wrapper.update()
  })

  it('renders a form', () => {
    expect(wrapper.exists('form')).toBeTruthy()
  })

  it('renders needed fields', () => {
    expect(wrapper.find('Field').length).toEqual(3)
  })

  it('renders labels for email, password', () => {
    expect(wrapper.containsMatchingElement(<Label>Email</Label>)).toBeTruthy()
    expect(wrapper.containsMatchingElement(<Label>Password</Label>)).toBeTruthy()
  })

  it('renders fields with controls', () => {
    wrapper.find('Field').forEach(field => {
      expect(field.exists('Control')).toBeTruthy()
    })
  })

  it('renders email input for email field', () => {
    const field = wrapper.findWhere(n => n.contains('Email') && n.name() == 'Field')
    expect(field.exists('Input')).toBeTruthy()
    const input = field.find('Input')
    expect(input.props().type).toEqual('email')
  })

  it('renders password input for password field', () => {
    const field = wrapper.findWhere(el => el.contains('Password') && el.name() == 'Field')
    expect(field.exists('Input')).toBeTruthy()
    const input = field.find('Input')
    expect(input.props().type).toEqual('password')
  })

  it('renders a login button', () => {
    const loginButton = wrapper.findWhere(el => el.contains('Login') && el.name() == 'Button')
    expect(loginButton.length).toEqual(1)
  })

  it('calls login function when button is clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onLoginClicked')
    wrapper.findWhere(el => el.contains('Login') && el.name() == 'Button').simulate('click')
    expect(spy).toHaveBeenCalled()
  })

  it('renders a cancel button', () => {
    const cancelButton = wrapper.findWhere(el => el.contains('Cancel') && el.name() == 'Button')
    expect(cancelButton.length).toEqual(1)
  })

  it('calls cancel function when button is clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onCancelClicked')
    wrapper.findWhere(el => el.contains('Cancel') && el.name() == 'Button').simulate('click')
    expect(spy).toHaveBeenCalled()
  })
})

import { shallow } from 'enzyme'
import React from 'react'
import '../../setupTests'
import { LoginWrapper, LoginForm } from './Login'

import { Label } from 'react-bulma-components/lib/components/form'

describe('LoginWrapper', () => {
  const wrapper = shallow(<LoginWrapper login={jest.fn()} />)

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

  it('renders a link to the registration page', () => {
    expect(wrapper.exists('Link')).toBeTruthy()
    expect(wrapper.find('Link').props().to).toEqual('/register')
  })

  it('calls login when attemptLogin is called', () => {
    const login = jest.fn()
    wrapper.setProps({ login })
    wrapper.instance().attemptLogin('testemail', 'testpass', true)
    expect(login).toHaveBeenCalledWith('testemail', 'testpass', true)

    wrapper.instance().attemptLogin('testemail', 'testpass', false)
    expect(login).toHaveBeenCalledWith('testemail', 'testpass', false)
  })
})

describe('LoginForm', () => {
  const wrapper = shallow(<LoginForm attemptLogin={jest.fn()} />)
  const mockEvent = { preventDefault: jest.fn() }

  beforeEach(() => {
    wrapper.update()
  })

  it('renders a form', () => {
    expect(wrapper.exists('form')).toBeTruthy()
  })

  it('renders needed fields', () => {
    expect(wrapper.find('Field').length).toEqual(4)
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
    const field = wrapper.findWhere(el => el.contains('Email') && el.name() == 'Field')
    expect(field.exists('Input')).toBeTruthy()
    const input = field.find('Input')
    expect(input.props().type).toEqual('email')
  })

  it('renders password input for password field', () => {
    const field = wrapper.findWhere(
      el => el.contains('Password') && el.name() == 'Field'
    )
    expect(field.exists('Input')).toBeTruthy()
    const input = field.find('Input')
    expect(input.props().type).toEqual('password')
  })

  it('renders a login button', () => {
    const loginButton = wrapper.findWhere(
      el => el.contains('Login') && el.name() == 'Button'
    )
    expect(loginButton.length).toEqual(1)
  })

  it('renders a remember checkbox', () => {
    expect(wrapper.exists('Checkbox')).toBeTruthy()
  })

  it('calls login function when button is clicked', () => {
    const attemptLogin = jest.fn()
    wrapper.setProps({ attemptLogin })
    wrapper.setState({ email: 'test@example.com', password: 'testpassword', remember: false})
    wrapper
      .findWhere(el => el.contains('Login') && el.name() == 'Button')
      .simulate('click', mockEvent)
    expect(attemptLogin).toHaveBeenCalledWith('test@example.com', 'testpassword', false)

    wrapper.setState({ email: 'test@example.com', password: 'testpassword', remember: true})
    wrapper
      .findWhere(el => el.contains('Login') && el.name() == 'Button')
      .simulate('click', mockEvent)
    expect(attemptLogin).toHaveBeenCalledWith('test@example.com', 'testpassword', true)
  })

  it('does not call login function if data is missing, sets errors', () => {
    const attemptLogin = jest.fn()
    wrapper.setProps({ attemptLogin })
    wrapper.setState({ email: '', password: 'testpassword' })
    wrapper
      .findWhere(el => el.contains('Login') && el.name() == 'Button')
      .simulate('click', mockEvent)
    expect(attemptLogin).not.toHaveBeenCalled()
    expect(wrapper.state().errors.email).toEqual('Email is required')

    wrapper.setState({ email: 'test@test.test', password: '' })
    wrapper
      .findWhere(el => el.contains('Login') && el.name() == 'Button')
      .simulate('click', mockEvent)
    expect(attemptLogin).not.toHaveBeenCalled()
    expect(wrapper.state().errors.password).toEqual('Password is required')
  })

  it('renders a cancel button', () => {
    const cancelButton = wrapper.findWhere(
      el => el.contains('Cancel') && el.name() == 'Button'
    )
    expect(cancelButton.length).toEqual(1)
  })

  it('calls cancel function when button is clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onCancelClicked')
    wrapper
      .findWhere(el => el.contains('Cancel') && el.name() == 'Button')
      .simulate('click', mockEvent)
    expect(spy).toHaveBeenCalled()
  })

  it('calls update field on email change', () => {
    const field = wrapper.findWhere(el => el.contains('Email') && el.name() == 'Field')
    const input = field.find('Input')
    input.simulate('change', { target: { value: 'test@example.com' } })
    expect(wrapper.state().email).toEqual('test@example.com')
  })

  it('updates state on password change', () => {
    const field = wrapper.findWhere(
      el => el.contains('Password') && el.name() == 'Field'
    )
    const input = field.find('Input')
    input.simulate('change', { target: { value: 'password123' } })
    expect(wrapper.state().password).toEqual('password123')
  })

  it('updates state on remember change', () => {
    const checkbox = wrapper.find('Checkbox')
    checkbox.simulate('click')
    expect(wrapper.state().remember).toBeTruthy()
  })
})

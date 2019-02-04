import { shallow, mount } from 'enzyme'
import React from 'react'
import '../../setupTests'
import { LoginWrapper, LoginForm } from './Login'

import { Label } from 'react-bulma-components/lib/components/form'

describe('LoginWrapper', () => {
  const wrapper = shallow(
    <LoginWrapper
      login={jest.fn()}
      alert={{ show: jest.fn() }}
      app={{ errors: {} }}
      history={{ goBack: jest.fn() }}
    />
  )

  beforeEach = () => {
    wrapper.update()
  }

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders the Header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
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

  it('calls showAlert with success message on successful login', async () => {
    const login = async () => {
      return Promise.resolve(true)
    }
    const alert = { show: jest.fn() }
    wrapper.setProps({ login, alert })
    await wrapper.instance().attemptLogin('testemail', 'testpassword', false)
    expect(alert.show).toHaveBeenCalledWith(
      <span className={'alert-text'}>Login Successful</span>,
      {
        type: 'success'
      }
    )
  })

  it('calls showAlert with failure message on failed login', async () => {
    const login = () => Promise.resolve(false)
    const alert = { show: jest.fn() }
    wrapper.setProps({ login, alert })
    await wrapper.instance().attemptLogin('testemail', 'testpassword', false)
    expect(alert.show).toHaveBeenCalledWith(
      <span className={'alert-text'}>Login Failed</span>,
      {
        type: 'error'
      }
    )
  })

  it('returns errors on failed login', async () => {
    const login = () => Promise.resolve(false)
    const errors = { someError: 'fail' }
    const app = { errors }
    wrapper.setProps({ login, app })
    expect(
      await wrapper.instance().attemptLogin('testemail', 'testpassword', false)
    ).toEqual(errors)
  })

  it('goes back to previous page on successful login', async () => {
    const login = async () => {
      return Promise.resolve(true)
    }
    const history = { goBack: jest.fn() }
    wrapper.setProps({ login, history })
    await wrapper.instance().attemptLogin('testemail', 'testpassword', false)
    expect(history.goBack).toHaveBeenCalled()
  })

  it('should redirect if already logged in', () => {
    const show = jest.fn()
    const goBack = jest.fn()
    wrapper.setProps({
      history: { goBack },
      app: { token: 'sometoken' },
      alert: { show }
    })
    wrapper.instance().componentDidMount()
    expect(show).toHaveBeenCalledWith(
      <span className={'alert-text'}>Already Logged In</span>
    )
    expect(goBack).toHaveBeenCalled()
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
    expect(wrapper.find('Field').length).toEqual(2)
    expect(wrapper.find('TextFieldWithErrors').length).toEqual(2)
  })

  it('updates state based on field', () => {
    wrapper.instance().onFieldChange({target: {value: 'test'}}, 'email')
    expect(wrapper.state().email).toEqual('test')
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
    wrapper.setState({
      email: 'test@example.com',
      password: 'testpassword',
      remember: false
    })
    wrapper
      .findWhere(el => el.contains('Login') && el.name() == 'Button')
      .simulate('click', mockEvent)
    expect(attemptLogin).toHaveBeenCalledWith('test@example.com', 'testpassword', false)

    wrapper.setState({
      email: 'test@example.com',
      password: 'testpassword',
      remember: true
    })
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

  it('updates state on remember change', () => {
    wrapper.find('Checkbox').first().simulate('click')
    expect(wrapper.state().remember).toBeTruthy()
  })

  it('sets error state if login fails with email error', async () => {
    const email = 'Please enter a valid email'
    const attemptLogin = async () => {
      return {
        email
      }
    }
    wrapper.setProps({ attemptLogin })
    wrapper.setState({ email: 'test', password: 'test' })
    await wrapper.instance().onLoginClicked(mockEvent)
    expect(wrapper.state().errors.email).toEqual(email)
  })

  it('sets error state if login fails with password error', async () => {
    const password = 'Please enter a valid password'
    const attemptLogin = () => {
      return {
        password
      }
    }
    wrapper.setProps({ attemptLogin })
    wrapper.setState({ email: 'test', password: 'test' })
    await wrapper.instance().onLoginClicked(mockEvent)
    expect(wrapper.state().errors.password).toEqual(password)
  })

  it('sets error state if login fails with non field error', async () => {
    const non_field_errors = 'Could not login with provided credentials'
    const attemptLogin = () => {
      return {
        non_field_errors
      }
    }
    wrapper.setProps({ attemptLogin })
    wrapper.setState({ email: 'test', password: 'test' })
    await wrapper.instance().onLoginClicked(mockEvent)
    expect(wrapper.state().errors.nonFieldErrors).toEqual(non_field_errors)
  })

  it('shows a message for non-field errors', () => {
    const nonFieldErrors = 'could not login'
    wrapper.setState({ errors: { nonFieldErrors } })
    expect(
      wrapper.findWhere(
        el => el.contains(nonFieldErrors) && el.name() == 'Notification'
      ).length
    ).toEqual(1)
  })
})

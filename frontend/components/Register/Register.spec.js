import { shallow } from 'enzyme'
import React from 'react'
import '../../setupTests'
import { Register, RegistrationForm } from './Register'

describe('Register', () => {
  const wrapper = shallow(
    <Register
      app={{ token: null }}
      history={{ goBack: jest.fn() }}
      alert={{ show: jest.fn() }}
      register={jest.fn()}
    />
  )
  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
  })

  it('renders a container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders a card', () => {
    expect(wrapper.exists('Card')).toBeTruthy()
  })

  it('renders the card header', () => {
    expect(wrapper.exists('CardHeader')).toBeTruthy()
  })

  it('renders the Registration form in CardContent', () => {
    expect(wrapper.exists('CardContent')).toBeTruthy()
    const cardContent = wrapper.find('CardContent')
    expect(cardContent.exists('RegistrationForm'))
  })

  it('redirects if already logged in', () => {
    const show = jest.fn()
    const goBack = jest.fn()
    wrapper.setProps({
      app: { token: 'sometoken' },
      history: { goBack },
      alert: { show }
    })
    wrapper.instance().componentDidMount()
    expect(show).toHaveBeenCalledWith(
      <span className={'alert-text'}>Already Logged In</span>
    )
    expect(goBack).toHaveBeenCalled()
  })

  it('calls register when attemptRegister is called', () => {
    const register = jest.fn()
    wrapper.setProps({ register })
    wrapper.instance().attemptRegister('testemail', 'testpass', 'testpass', true)
    expect(register).toHaveBeenCalledWith('testemail', 'testpass', 'testpass', true)

    wrapper.instance().attemptRegister('testemail', 'testpass', 'testpass', false)
    expect(register).toHaveBeenCalledWith('testemail', 'testpass', 'testpass', false)
  })

  it('calls showAlert with success message on successful register', async () => {
    const register = async (_email, _pass, _pass2, _remember) => Promise.resolve(true)

    const alert = { show: jest.fn() }
    wrapper.setProps({ register, alert })
    await wrapper
      .instance()
      .attemptRegister('testemail', 'testpassword', 'testpassword', false)
    expect(alert.show).toHaveBeenCalledWith(
      <span className={'alert-text'}>Registration Successful</span>,
      {
        type: 'success'
      }
    )
  })

  it('calls showAlert with failure message on failed register', async () => {
    const register = () => Promise.resolve(false)
    const alert = { show: jest.fn() }
    wrapper.setProps({ register, alert })
    await wrapper
      .instance()
      .attemptRegister('testemail', 'testpassword', 'testpassword', false)
    expect(alert.show).toHaveBeenCalledWith(
      <span className={'alert-text'}>Registration Failed</span>,
      {
        type: 'error'
      }
    )
  })

  it('returns errors on failed register', async () => {
    const register = () => Promise.resolve(false)
    const errors = { someError: 'fail' }
    const app = { errors }
    wrapper.setProps({ register, app })
    expect(
      await wrapper
        .instance()
        .attemptRegister('testemail', 'testpassword', 'testpassword', false)
    ).toEqual(errors)
  })

  it('goes back to previous page on successful register', async () => {
    const register = async (_email, _pass, _pass2, _remember) => Promise.resolve(true)

    const history = { goBack: jest.fn() }
    wrapper.setProps({ register, history })
    await wrapper
      .instance()
      .attemptRegister('testemail', 'testpassword', 'testpassword', false)
    expect(history.goBack).toHaveBeenCalled()
  })
})

describe('RegistrationForm', () => {
  const wrapper = shallow(<RegistrationForm attemptRegister={jest.fn()} />)
  const mockEvent = { preventDefault: jest.fn() }
  beforeEach(() => {
    wrapper.update()
  })

  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a form', () => {
    expect(wrapper.exists('form')).toBeTruthy()
  })

  it('renders needed fields', () => {
    expect(wrapper.find('Field').length).toEqual(2)
    expect(wrapper.find('TextFieldWithErrors').length).toEqual(3)
  })

  it('renders a remember checkbox', () => {
    expect(wrapper.exists('Checkbox')).toBeTruthy()
    expect(wrapper.find('Checkbox').contains('Keep'))
  })

  it('renders a register button', () => {
    const registerButton = wrapper.findWhere(
      el => el.contains('Register') && el.name() == 'Button'
    )
    expect(registerButton.length).toEqual(1)
  })

  it('renders a cancel button', () => {
    const cancelButton = wrapper.findWhere(
      el => el.contains('Cancel') && el.name() == 'Button'
    )
    expect(cancelButton.length).toEqual(1)
  })

  it('calls onRegsiterClicked when register button is clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onRegisterClicked')
    wrapper
      .findWhere(el => el.contains('Register') && el.name() == 'Button')
      .simulate('click')
    expect(spy).toHaveBeenCalled()
  })

  it('calls onCancelClicked when cancel is clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onCancelClicked')
    wrapper
      .findWhere(el => el.contains('Cancel') && el.name() == 'Button')
      .simulate('click')
    expect(spy).toHaveBeenCalled()
  })

  it('updates relevent state on field change', () => {
    wrapper.instance().onFieldChange({ target: { value: 'test' } }, 'email')
    expect(wrapper.state().email).toEqual('test')
  })

  it('updates state on remember change', () => {
    wrapper
      .find('Checkbox')
      .first()
      .simulate('change')
    expect(wrapper.state().remember).toBeTruthy()
  })

  it('calls register function when button is clicked', () => {
    const attemptRegister = jest.fn()
    wrapper.setProps({ attemptRegister })
    wrapper.setState({
      email: 'test@example.com',
      password1: 'testpassword',
      password2: 'testpassword',
      remember: false
    })
    simulateRegisterClick(wrapper, mockEvent)
    expect(attemptRegister).toHaveBeenCalledWith(
      'test@example.com',
      'testpassword',
      'testpassword',
      false
    )

    wrapper.setState({
      email: 'test@example.com',
      password1: 'testpassword',
      password2: 'testpassword',
      remember: true
    })
    simulateRegisterClick(wrapper, mockEvent)
    expect(attemptRegister).toHaveBeenCalledWith(
      'test@example.com',
      'testpassword',
      'testpassword',
      true
    )
  })

  it('does not call register function if data is missing or invalid, sets errors', () => {
    const attemptRegister = jest.fn()
    wrapper.setProps({ attemptRegister })
    wrapper.setState({
      email: '',
      password1: 'testpassword',
      password2: 'testpassword'
    })
    simulateRegisterClick(wrapper, mockEvent)
    expect(attemptRegister).not.toHaveBeenCalled()
    expect(wrapper.state().errors.email).toEqual('Email is required')

    wrapper.setState({ email: 'test@test.test', password1: '', password2: '' })
    simulateRegisterClick(wrapper, mockEvent)
    expect(attemptRegister).not.toHaveBeenCalled()
    expect(wrapper.state().errors.password1).toEqual('Password is required')

    wrapper.setState({
      email: 'test@test.test',
      password1: 'testpass',
      password2: 'testdifferent'
    })
    simulateRegisterClick(wrapper, mockEvent)
    expect(attemptRegister).not.toHaveBeenCalled()
    expect(wrapper.state().errors.password2).toEqual('Passwords need to match')
  })

  it('sets error state if register fails with email error', async () => {
    const email = 'Please enter a valid email'
    const attemptRegister = async (_e, _p, _r) => {
      return {
        email
      }
    }
    wrapper.setProps({ attemptRegister })
    wrapper.setState({ email: 'test', password1: 'test', password2: 'test' })
    await wrapper.instance().onRegisterClicked(mockEvent)
    expect(wrapper.state().errors.email).toEqual(email)
  })

  it('sets error state if register fails with password1 error', async () => {
    const password1 = 'Please enter a valid password'
    const attemptRegister = (_e, _p, _r) => {
      return {
        password1
      }
    }
    wrapper.setProps({ attemptRegister })
    wrapper.setState({
      email: 'test@example.com',
      password1: 'test',
      password2: 'test'
    })
    await wrapper.instance().onRegisterClicked(mockEvent)
    expect(wrapper.state().errors.password1).toEqual(password1)
  })

  it('sets error state if register fails with password2 error', async () => {
    const password2 = 'Please enter a valid password'
    const attemptRegister = (_e, _p, _r) => {
      return {
        password2
      }
    }
    wrapper.setProps({ attemptRegister })
    wrapper.setState({
      email: 'test@example.com',
      password1: 'test',
      password2: 'test'
    })
    await wrapper.instance().onRegisterClicked(mockEvent)
    expect(wrapper.state().errors.password2).toEqual(password2)
  })

  it('sets error state if register fails with non field error', async () => {
    const non_field_errors = 'Could not register with provided credentials'
    const attemptRegister = (_e, _p, _r) => {
      return {
        non_field_errors
      }
    }
    wrapper.setProps({ attemptRegister })
    wrapper.setState({
      email: 'test@example.com',
      password1: 'test',
      password2: 'test'
    })
    await wrapper.instance().onRegisterClicked(mockEvent)
    expect(wrapper.state().errors.nonFieldErrors).toEqual(non_field_errors)
  })

  it('shows a message for non-field errors', () => {
    const nonFieldErrors = 'could not register'
    wrapper.setState({ errors: { nonFieldErrors } })
    expect(
      wrapper.findWhere(
        el => el.contains(nonFieldErrors) && el.name() == 'Notification'
      ).length
    ).toEqual(1)
  })
})

function simulateRegisterClick(wrapper, e) {
  wrapper
    .findWhere(el => el.contains('Register') && el.name() == 'Button')
    .simulate('click', e)
}

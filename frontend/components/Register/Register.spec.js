import React from 'react'
import { shallow } from 'enzyme'
import Register, { RegistrationForm } from './Register'

import '../../setupTests'
import { Label } from 'react-bulma-components/lib/components/form'

describe('<Register />', () => {
  const wrapper = shallow(<Register />)
  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Header')).toBeTruthy()
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
})

describe('<RegistrationForm />', () => {
  const wrapper = shallow(<RegistrationForm />)
  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a form', () => {
    expect(wrapper.exists('form')).toBeTruthy()
  })

  it('renders 4 fields', () => {
    expect(wrapper.find('Field').length).toEqual(4)
  })

  it('renders labels for email, password1, password1', () => {
    expect(wrapper.containsMatchingElement(<Label>Email</Label>)).toBeTruthy()
    expect(wrapper.containsMatchingElement(<Label>Password</Label>)).toBeTruthy()
    expect(wrapper.containsMatchingElement(<Label>Confirm Password</Label>)).toBeTruthy()
  })

  it('renders a control for each field', () => {
    const fields = wrapper.find('Field')
    fields.forEach(field => {
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
    const fields = wrapper.findWhere(el => el.contains('Password') && el.name() == 'Field')
    fields.forEach(field => {
      expect(field.exists('Input')).toBeTruthy()
      const input = field.find('Input')
      expect(input.props().type).toEqual('password')
    })
  })

  it('renders a register button', () => {
    const registerButton = wrapper.findWhere(el => el.contains('Register') && el.name() == 'Button')
    expect(registerButton.length).toEqual(1)
  })

  it('renders a cancel button', () => {
    const cancelButton = wrapper.findWhere(el => el.contains('Cancel') && el.name() == 'Button')
    expect(cancelButton.length).toEqual(1)
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import Routes from './Routes'

import { testToken } from '../../testHelpers'

import '../../setupTests'

describe('Routes', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Routes attemptLogin={jest.fn()} />)
  })

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a switch when it finishes trying to authenticate', () => {
    wrapper.setState({ isAuthenticating: false })
    expect(wrapper.exists('Switch')).toBeTruthy()
  })

  it('attempts to login from localStorage token and unset isAuthenticating', async () => {
    localStorage.setItem('token', testToken)
    const attemptLogin = jest.fn()
    wrapper.setProps({ attemptLogin })
    await wrapper.instance().componentDidMount()
    expect(attemptLogin).toHaveBeenCalledWith(testToken)
    expect(wrapper.state().isAuthenticating).toBeFalsy()
  })

  it('does not attempt login without localstorage token', async () => {
    localStorage.removeItem('token')
    const attemptLogin = jest.fn()
    wrapper.setProps({ attemptLogin })
    await wrapper.instance().componentDidMount()
    expect(attemptLogin).not.toHaveBeenCalledWith()
    expect(wrapper.state().isAuthenticating).toBeFalsy()
  })
})

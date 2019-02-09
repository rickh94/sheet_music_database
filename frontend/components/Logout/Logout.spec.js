import React from 'react'
import { shallow } from 'enzyme'
import '../../setupTests'
import { Logout } from './Logout'

describe('Logout', () => {
  const wrapper = shallow(
    <Logout
      history={{ goBack: jest.fn() }}
      logout={jest.fn()}
      account={{ token: 'testtokentext' }}
      alert={{ show: jest.fn() }}
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

  it('renders the Header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
  })

  it('renders a card', () => {
    expect(wrapper.exists('Card')).toBeTruthy()
  })

  it('renders the needed buttons', () => {
    expect(wrapper.find('Button').length).toEqual(3)
  })

  it('shows a notification if there are errors', () => {
    wrapper.setState({ errors: 'some error' })
    expect(wrapper.exists('Notification')).toBeTruthy()
  })

  it('goes back on cancel', () => {
    const history = { goBack: jest.fn() }
    wrapper.setProps({ history })
    wrapper
      .findWhere(el => el.name() == 'Button' && el.contains('Cancel'))
      .simulate('click')
    expect(history.goBack).toHaveBeenCalled()
  })

  it('calls calback on logout button clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onLogoutClicked')
    wrapper
      .findWhere(
        el => el.name() == 'Button' && el.contains('Logout') && !el.contains('All')
      )
      .simulate('click')
    expect(spy).toHaveBeenCalled()
  })

  it('calls calback on logout all button clicked', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onLogoutAllClicked')
    wrapper
      .findWhere(el => el.name() == 'Button' && el.contains('Logout All'))
      .simulate('click')
    expect(spy).toHaveBeenCalled()
  })

  it('calls the logout function onLogoutClick is called', async () => {
    const logout = jest.fn()
    const token = 'sometokentext'
    const spy = jest.spyOn(wrapper.instance(), 'handleLogout')
    wrapper.setProps({ logout, account: { token } })
    await wrapper.instance().onLogoutClicked()
    expect(logout).toHaveBeenCalledWith(token)
    expect(spy).toHaveBeenCalledWith(undefined)
  })

  it('calls the logout function onLogoutAllClick is called and shows notification', async () => {
    const logout = jest.fn()
    const token = 'sometokentext'
    const spy = jest.spyOn(wrapper.instance(), 'handleLogout')
    wrapper.setProps({ logout, account: { token } })
    await wrapper.instance().onLogoutAllClicked()
    expect(logout).toHaveBeenCalledWith(token, true)
    expect(spy).toHaveBeenCalledWith(undefined, true)
  })

  it('shows an alert, and redirect based on success state', () => {
    const alert = { show: jest.fn() }
    const history = { push: jest.fn() }
    wrapper.setProps({ alert, history })
    wrapper.instance().handleLogout(true)
    expect(alert.show).toHaveBeenCalledWith(
      <span className={'alert-text'}>Logout Successful</span>,
      { type: 'success' }
    )
    expect(history.push).toHaveBeenCalledWith('/')
    wrapper.instance().handleLogout(false, true, 'some error')
    expect(alert.show).toHaveBeenCalledWith(
      <span className={'alert-text'}>Logout All Failed</span>,
      { type: 'error' }
    )
    expect(wrapper.state().errors).toEqual('some error')
  })

  it('redirects and shows alert if there is no token', () => {
    const history = { goBack: jest.fn() }
    const alert = { show: jest.fn() }
    wrapper.setProps({ account: { token: null }, history, alert })
    wrapper.instance().componentDidMount()
    expect(history.goBack).toHaveBeenCalled()
    expect(alert.show).toHaveBeenCalledWith(
      <span className={'alert-text'}>Not Logged In</span>,
      { type: 'error' }
    )
  })
})

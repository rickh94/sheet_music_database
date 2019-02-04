import React from 'react'
import { shallow } from 'enzyme'

import { Header } from './Header'
import '../../setupTests'

describe('Header', () => {
  const wrapper = shallow(<Header app={{ token: null }} />)

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a Navbar', () => {
    expect(wrapper.exists('Navbar')).toBeTruthy()
  })

  it('renders a Brand', () => {
    expect(wrapper.exists('NavbarBrand')).toBeTruthy()
  })

  it('renders a Burger', () => {
    expect(wrapper.exists('NavbarBurger')).toBeTruthy()
  })

  it('renders a menu', () => {
    expect(wrapper.exists('NavbarMenu')).toBeTruthy()
  })

  it('opens menu state', () => {
    const burger = wrapper.find('NavbarBurger')
    burger.simulate('click')
    expect(wrapper.state().open).toBeTruthy()
  })

  it('closes menu state', () => {
    const burger = wrapper.find('NavbarBurger')
    wrapper.setState({ open: true })
    burger.simulate('click')
    expect(wrapper.state().open).toBeFalsy()
  })

  it('sets active class on menu and burger', () => {
    wrapper.setState({ open: true })
    expect(wrapper.find('.is-active').length).toEqual(2)
  })

  it('unsets active class on menu and burger', () => {
    wrapper.setState({ open: false })
    expect(wrapper.find('.is-active').length).toEqual(0)
  })

  it('shows login and register if not logged it, does not show logout and account', () => {
    expect(
      wrapper.findWhere(el => el.contains('Login') && el.name() == 'NavbarItem').length
    ).toEqual(1)
    expect(
      wrapper.findWhere(el => el.contains('Register') && el.name() == 'NavbarItem')
        .length
    ).toEqual(1)
    expect(
      wrapper.findWhere(el => el.contains('Logout') && el.name() == 'NavbarItem').length
    ).toEqual(0)
    expect(
      wrapper.findWhere(el => el.contains('Account') && el.name() == 'NavbarItem')
        .length
    ).toEqual(0)
  })

  it('shows logout and Account if logged in, does not show login or register', () => {
    wrapper.setProps({ app: { token: 'sometoken' } })
    expect(
      wrapper.findWhere(el => el.contains('Login') && el.name() == 'NavbarItem').length
    ).toEqual(0)
    expect(
      wrapper.findWhere(el => el.contains('Register') && el.name() == 'NavbarItem')
        .length
    ).toEqual(0)
    expect(
      wrapper.findWhere(el => el.contains('Logout') && el.name() == 'NavbarItem').length
    ).toEqual(1)
    expect(
      wrapper.findWhere(el => el.contains('Account') && el.name() == 'NavbarItem')
        .length
    ).toEqual(1)
  })
})

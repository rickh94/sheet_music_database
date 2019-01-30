import React from 'react'
import { shallow } from 'enzyme'

import Header from './Header'
import '../../setupTests'

describe('Header', () => {
  const wrapper = shallow(<Header />)
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
    wrapper.setState({open: true})
    burger.simulate('click')
    expect(wrapper.state().open).toBeFalsy()
  })

  it('sets active class on menu and burger', () => {
    wrapper.setState({open: true})
    expect(wrapper.find('.is-active').length).toEqual(2)
  })

  it('unsets active class on menu and burger', () => {
    wrapper.setState({open: false})
    expect(wrapper.find('.is-active').length).toEqual(0)
  })

})

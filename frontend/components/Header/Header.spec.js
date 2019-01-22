import React from 'react'
import { shallow } from 'enzyme'
import Header from './Header'
import '../../setupTests'
import Navbar from 'react-bulma-components/lib/components/navbar'

describe('Header', () => {
  const wrapper = shallow(<Header />)
  it('renders a Navbar', () => {
    expect(wrapper.find('Navbar').length).toEqual(1)
  })

  it('renders a Brand', () => {
    expect(wrapper.containsMatchingElement(<Navbar.Brand>Sheet Music Database</Navbar.Brand>)).toBeTruthy()
  })

  it('renders a Burger', () => {
    expect(wrapper.containsMatchingElement(<Navbar.Burger active={wrapper.instance().state.open} />)).toBeTruthy()
  })

  it('renders a menu', () => {
    expect(wrapper.find('#nav-menu').length).toBeTruthy()
  })
})

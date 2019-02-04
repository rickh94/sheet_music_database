import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
import '../../setupTests'

describe('App', () => {
  const wrapper = shallow(<App />)

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders two Providers (Redux and Alert)', () => {
    expect(wrapper.find('Provider').length).toEqual(2)
  })

  it('renders a router', () => {
    expect(wrapper.find('BrowserRouter').length).toEqual(1)
  })

  it('renders a switch', () => {
    expect(wrapper.find('Switch').length).toEqual(1)
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
import '../../setupTests'

describe('App', () => {
  const wrapper = shallow(<App />)

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the routes', () => {
    expect(wrapper.exists('Connect(Routes)')).toBeTruthy()
  })

  it('renders two Providers (Redux and Alert)', () => {
    expect(wrapper.find('Provider').length).toEqual(2)
  })
})

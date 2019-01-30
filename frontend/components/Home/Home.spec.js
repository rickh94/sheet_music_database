import React from 'react'
import { shallow } from 'enzyme'
import  Container from 'react-bulma-components/lib/components/container'
import Home from './Home'
import '../../setupTests'

describe('Home', () => {
  const wrapper = shallow(<Home />)
  it('renders an enclosing container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Header')).toBeTruthy()
  })

})

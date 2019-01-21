import React from 'react'
import { shallow } from 'enzyme'
import Home from './Home'
import '../../setupTests'

describe('Home', () => {
  const wrapper = shallow(<Home />)
  it('renders a div', () => {
    expect(wrapper.find('div').length).toEqual(1)
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import NotFound from './NotFound'

import '../../setupTests'

describe('<NotFound />', () => {
  const wrapper = shallow(<NotFound />)
  beforeEach(() => {
    wrapper.update()
  })

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the Header', () => {
    expect(wrapper.exists('Header')).toBeTruthy()
  })

  it('renders a container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders a Card with some margin', () => {
    const card = wrapper.find('Card')
    expect(card.length).toEqual(1)
    expect(card.hasClass('margin-default')).toBeTruthy()
  })
})

import { shallow } from 'enzyme'
import React from 'react'
import '../../setupTests'
import Home from './Home'

describe('Home', () => {
  const wrapper = shallow(<Home />)
  it('renders an enclosing container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Header')).toBeTruthy()
  })

  it('renders a card', () => {
    expect(wrapper.exists('Card')).toBeTruthy()
  })

  it('renders card content', () => {
    expect(wrapper.exists('CardContent')).toBeTruthy()
  })

  it('renders the title and subtitle, and section header', () => {
    expect(wrapper.find('Heading').length).toEqual(3)
  })

  it('renders some text in the card content', () => {
    expect(wrapper.exists('Content')).toBeTruthy()
  })

  it('renders a card footer', () => {
    expect(wrapper.exists('CardFooter')).toBeTruthy()
  })

  it('renders 4 Description Cards', () => {
    expect(wrapper.find('.description-card').length).toEqual(4)
  })

})

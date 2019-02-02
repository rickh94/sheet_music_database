import { shallow } from 'enzyme'
import React from 'react'
import '../../setupTests'
import Home, { DescriptionCard } from './Home'

describe('Home', () => {
  const wrapper = shallow(<Home />)

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

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
    expect(wrapper.find('DescriptionCard').length).toEqual(4)
  })
})

describe('DescriptionCard', () => {
  const wrapper = shallow(<DescriptionCard title="Test">test body</DescriptionCard>)
  beforeEach(() => {
    wrapper.update()
  })
  it('renders a Card', () => {
    expect(wrapper.exists('Card')).toBeTruthy()
    expect(wrapper.hasClass('description-card')).toBeTruthy()
  })

  it('renders the card title from props', () => {
    expect(wrapper.exists('CardHeader')).toBeTruthy()
    expect(wrapper.exists('CardHeaderTitle')).toBeTruthy()
    const title = wrapper.find('CardHeaderTitle')
    expect(title.contains('Test')).toBeTruthy()
  })

  it('renders the body from props', () => {
    expect(wrapper.exists('CardContent')).toBeTruthy()
    const content = wrapper.find('CardContent')
    expect(content.contains('test body')).toBeTruthy()
  })

  it('adds margin without column prop', () => {
    expect(wrapper.hasClass('margin-default')).toBeTruthy()
  })

  it('adds no margin with column prop', () => {
    wrapper.setProps({ title: 'Test', children: 'test body', column: true })
    expect(wrapper.hasClass('margin-default')).toBeFalsy()
  })
})

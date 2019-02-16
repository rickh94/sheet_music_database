import React from 'react'
import { shallow } from 'enzyme'
import ItalicLink from './ItalicLink'

import '../../setupTests'
import { clickLink } from '../../testHelpers'

describe('<ItalicLink />', () => {
  let wrapper
  const content = 'test link'

  beforeEach(() => {
    wrapper = shallow(<ItalicLink onClick={jest.fn()}>{content}</ItalicLink>)
  })

  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('passes through className and style and adds italic-link class', () => {
    const className = 'some classes'
    const style = { test: 'test' }
    wrapper.setProps({ className, style })
    expect(wrapper.find('a').props().className).toEqual(`${className} italic-link`)
    expect(wrapper.find('a').props().style).toEqual(style)
  })

  it('renders children', () => {
    expect(wrapper.contains(content)).toBeTruthy()
  })

  it('calls on click on click', () => {
    const onClick = jest.fn()
    wrapper.setProps({ onClick })
    clickLink(wrapper, content)
    expect(onClick).toHaveBeenCalled()
  })
})

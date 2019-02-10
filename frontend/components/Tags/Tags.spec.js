import React from 'react'
import { shallow } from 'enzyme'
import { Tags, TagItem } from './Tags'
import '../../setupTests'

describe('Tags', () => {
  const testToken = 'testtoken'
  const wrapper = shallow(
    <Tags
      history={{ push: jest.fn() }}
      token={testToken}
      alert={{ show: jest.fn() }}
      getTags={jest.fn()}
      tags={{}}
    />
  )
  
  beforeEach(() => {
    wrapper.update()
  })

  it('matches the snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
  })

  it('renders a list', () => {
    expect(wrapper.exists('ul')).toBeTruthy()
  })

  it('renders tags from the list', () => {
    const tags = { list: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }] }
    wrapper.setState({ tags })
    expect(wrapper.find('TagItem').length).toEqual(2)
  })

  it('redirects if not logged in', () => {
    const history = { push: jest.fn() }
    const token = null
    const alert = { show: jest.fn() }
    wrapper.setProps({ token, history, alert })
    wrapper.instance().componentDidMount()
    expect(history.push).toHaveBeenCalledWith('/login')
    expect(alert.show).toHaveBeenCalledWith(
      <span className="alert-text">Please log in</span>,
      { type: 'error' }
    )
  })

  it('gets tags if logged in', () => {
    const getTags = jest.fn()
    wrapper.setProps({ getTags, token: testToken })
    wrapper.instance().componentDidMount()
    expect(getTags).toHaveBeenCalledWith(testToken)
  })

  it('shows an error on get failure', () => {
    const getTags = () => false
    const alert = {show: jest.fn()}
    wrapper.setProps({getTags, token: testToken, alert})
    wrapper.instance().componentDidMount()
    expect(alert.show).toHaveBeenCalledWith(
      <span className="alert-text">Could not get Tags</span>,
      { type: 'error' }
    )
  })
})

describe('TagItem', () => {
  const testTag = { id: 5, name: 'test' }
  const wrapper = shallow(
    <TagItem tag={testTag} saveCallback={jest.fn()} deleteCallback={jest.fn()} />
  )

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a list item', () => {
    expect(wrapper.exists('li')).toBeTruthy()
  })

  it('has delete link with icon', () => {
    expect(wrapper.contains('delete')).toBeTruthy()
    expect(wrapper.find('FontAwesomeIcon')).toBeTruthy()
  })

  it('calls passed in function when delete is clicked', () => {
    const deleteCallback = jest.fn()
    wrapper.setProps({ deleteCallback })
    wrapper
      .findWhere(el => el.name() == 'a' && el.contains('delete'))
      .simulate('click', { preventDefault: jest.fn() })
    expect(deleteCallback).toHaveBeenCalledWith(testTag.id)
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import Tags, { TagItem } from './Tags'
import '../../setupTests'

describe('Tags', () => {
  const wrapper = shallow(<Tags />)
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
})

describe('TagItem', () => {
  const testTag = { id: 5, name: 'test' }
  const wrapper = shallow(
    <TagItem tag={testTag} editCallback={jest.fn()} deleteCallback={jest.fn()} />
  )

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a list item', () => {
    expect(wrapper.exists('li')).toBeTruthy()
  })

  it('has edit and delete links with icons', () => {
    expect(wrapper.contains('edit')).toBeTruthy()
    expect(wrapper.contains('delete')).toBeTruthy()
    expect(wrapper.find('FontAwesomeIcon')).toBeTruthy()
  })

  it('calls passed in function when edit is clicked', () => {
    const editCallback = jest.fn()
    wrapper.setProps({ editCallback })
    wrapper
      .findWhere(el => el.name() == 'a' && el.contains('edit'))
      .simulate('click', { preventDefault: jest.fn() })
    expect(editCallback).toHaveBeenCalledWith(testTag.id)
  })

  it('calls passed in function when delete is clicked', () => {
    const deleteCallback = jest.fn()
    wrapper.setProps({ deleteCallback })
    wrapper
      .findWhere(el => el.name() == 'a' && el.contains('delete'))
      .simulate('click', { preventDefault: jest.fn() })
    expect(deleteCallback).toHaveBeenCalledWith(testTag.id)
  })

  it('links to the detail page', () => {
    const link = wrapper.find('Link')
    expect(link.props().to).toEqual(`/tag/${testTag.id}`)
  })
})

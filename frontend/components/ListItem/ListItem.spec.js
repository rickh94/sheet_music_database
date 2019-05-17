import React from 'react'
import { shallow } from 'enzyme'
import ListItem from './ListItem'

import '../../setupTests'

describe('TagItem', () => {
  const testItem = { id: 5, name: 'test' }
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <ListItem
        item={testItem}
        saveCallback={jest.fn()}
        deleteCallback={jest.fn()}
        link={'test item'}
      />
    )
  })

  it('matches snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a Level', () => {
    expect(wrapper.exists('Level')).toBeTruthy()
  })

  it('has delete link with icon', () => {
    expect(wrapper.contains('delete')).toBeTruthy()
  })

  it('does not render a delete link with no delete callback', () => {
    wrapper.setProps({deleteCallback: null})
    expect(wrapper.contains('delete')).toBeFalsy()
  })

  it('calls passed in function when delete is clicked', () => {
    const deleteCallback = jest.fn()
    wrapper.setProps({ deleteCallback })
    wrapper
      .findWhere(el => el.name() == 'a' && el.contains('delete'))
      .simulate('click', { preventDefault: jest.fn() })
    expect(deleteCallback).toHaveBeenCalledWith(testItem.id)
  })
})

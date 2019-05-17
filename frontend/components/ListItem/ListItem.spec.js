import React from 'react'
import { shallow } from 'enzyme'
import ListItem from './ListItem'

import '../../setupTests'
import { clickButton } from '../../testHelpers';

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

  it('has a confirm delete modal', () => {
    expect(wrapper.find('Modal').contains('Confirm Delete')).toBeTruthy()
  })

  it('calls passed in function when confirm is clicked', () => {
    const deleteCallback = jest.fn()
    wrapper.setProps({ deleteCallback })
    clickButton(wrapper, 'Confirm')
    expect(deleteCallback).toHaveBeenCalledWith(testItem.id)
  })
})

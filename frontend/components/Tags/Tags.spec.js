import React from 'react'
import { shallow } from 'enzyme'
import { Tags, TagItem } from './Tags'
import '../../setupTests'
import {
  testLoggedIn,
  testToken,
  testGetData,
  testGetDataFailed
} from '../../testHelpers'

function clickButton(wrapper, name) {
  wrapper
    .findWhere(el => el.name() == 'Button' && el.contains(name))
    .simulate('click', { preventDefault: jest.fn() })
}

describe('Tags', () => {
  const wrapper = shallow(
    <Tags
      history={{ push: jest.fn() }}
      token={testToken}
      alert={{ show: jest.fn() }}
      tags={{ list: [] }}
      getTags={jest.fn()}
      createTag={jest.fn()}
      deleteTag={jest.fn()}
      updateTag={jest.fn()}
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

  it('renders a div', () => {
    expect(wrapper.exists('div')).toBeTruthy()
  })

  it('renders tags from the list', () => {
    const tags = { list: [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }] }
    wrapper.setProps({ tags })
    expect(wrapper.find('TagItem').length).toEqual(2)
  })

  it('redirects if not logged in', () => {
    testLoggedIn(wrapper)
  })

  it('gets tags if logged in', () => {
    testGetData(wrapper, 'getTags')
  })

  it('shows an error on get failure', () => {
    testGetDataFailed(wrapper, 'getTags', 'Tags')
  })

  it('renders a create button', () => {
    wrapper.find('#activate-create').simulate('click')
    expect(wrapper.state().createMode).toBeTruthy()
  })

  it('renders a modal for creating new tags', () => {
    expect(wrapper.exists('Modal')).toBeTruthy()
    expect(wrapper.find('Modal').contains('New Tag')).toBeTruthy()
    expect(wrapper.find('Modal').contains('TextFieldWithError'))
  })

  it('has a button to save created tag, and resets state', () => {
    const createTag = jest.fn()
    const newTagName = 'new test tag name'
    wrapper.setProps({ createTag })
    wrapper.setState({ newTagName, createMode: true })
    clickButton(wrapper, 'Save')
    expect(createTag).toHaveBeenCalledWith(testToken, newTagName)
    expect(wrapper.state().createMode).toBeFalsy()
    expect(wrapper.state().newTagName).toEqual('')
  })

  it('has a cancel button that closes the modal and reset newtagname', () => {
    wrapper.setState({ createMode: true, newTagName: 'test tag name' })
    clickButton(wrapper, 'Cancel')
    expect(wrapper.state().createMode).toBeFalsy()
    expect(wrapper.state().newTagName).toEqual('')
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

  it('renders a Level', () => {
    expect(wrapper.exists('Level')).toBeTruthy()
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

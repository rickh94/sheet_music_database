import React from 'react'
import { shallow } from 'enzyme'
import { Tags } from './Tags'
import '../../setupTests'
import {
  testLoggedIn,
  testToken,
  testGetData,
  testGetDataFailed,
  clickButton
} from '../../testHelpers'


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
    expect(wrapper.find('ListItem').length).toEqual(2)
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
    expect(wrapper.find('Modal').exists('TextFieldWithErrors')).toBeTruthy()
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

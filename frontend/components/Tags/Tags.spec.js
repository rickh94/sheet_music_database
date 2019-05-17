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
    const spy = jest.spyOn(wrapper.instance(), 'handleSubmit')
    wrapper.setProps({ createTag })
    wrapper.setState({ newTagName, createMode: true })
    clickButton(wrapper, 'Save')
    expect(spy).toHaveBeenCalled()
  })

  it('has a cancel button that closes the modal and reset newtagname', () => {
    wrapper.setState({ createMode: true, newTagName: 'test tag name' })
    clickButton(wrapper, 'Cancel')
    expect(wrapper.state().createMode).toBeFalsy()
    expect(wrapper.state().newTagName).toEqual('')
  })

  describe('handle submit', () => {
    const e = { preventDefault: jest.fn() }
    it('returns and sets errors if no name', async () => {
      const createTag = jest.fn()
      wrapper.setProps({ createTag })
      wrapper.setState({ newTagName: '', createMode: true })
      await wrapper.instance().handleSubmit(e)
      expect(createTag).not.toHaveBeenCalled()
      expect(wrapper.state().errors.name).toEqual('Tag name is required')
      expect(wrapper.state().createMode).toBeTruthy()
    })

    it('calls create tag and clears form on success', async () => {
      const createTag = jest.fn()
      const show = jest.fn()
      createTag.mockReturnValue(true)
      wrapper.setProps({ createTag, alert: { show } })
      wrapper.setState({
        newTagName: 'testname', createMode: true
      })
      await wrapper.instance().handleSubmit(e)
      expect(createTag).toHaveBeenCalledWith(testToken, 'testname')
      expect(show).toHaveBeenCalledWith(<span className="alert-text">Tag Created</span>)
      expect(wrapper.state().newTagName).toEqual('')
    })

    it('sets errors and shows alert on failure', async () => {
      const createTag = jest.fn()
      const show = jest.fn()
      createTag.mockReturnValue(false)
      wrapper.setProps({
        createTag,
        alert: { show },
        tags: { errors: { name: 'test error' }, list: [] }
      })
      wrapper.setState({
        newTagName: 'testname', createMode: true
      })
      await wrapper.instance().handleSubmit(e)
      expect(createTag).toHaveBeenCalledWith(testToken, 'testname')
      expect(show).toHaveBeenCalledWith(
        <span className="alert-text">Tag Creation Failed</span>,
        { type: 'error' }
      )
      expect(wrapper.state().errors.name).toEqual('test error')
      expect(wrapper.state().createMode).toBeTruthy()
    })
  })
})

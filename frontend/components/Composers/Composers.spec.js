import React from 'react'
import { shallow } from 'enzyme'
import { Composers, ComposerItem } from './Composers'
import '../../setupTests'
import {
  testLoggedIn,
  testGetData,
  testGetDataFailed,
  testToken
} from '../../testHelpers'

describe('Composers', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <Composers
        composers={{ list: [] }}
        alert={{ show: jest.fn() }}
        getComposers={jest.fn()}
        createComposer={jest.fn()}
        updateComposer={jest.fn()}
        token={testToken}
        history={{ push: jest.fn() }}
      />
    )
  })

  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
  })

  it('renders a container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders composers from props', () => {
    const composers = { list: [{ id: 1, name: 'Test' }, { id: 2, name: 'Test2' }] }
    wrapper.setProps({ composers })
    expect(wrapper.find('ComposerItem').length).toEqual(2)
  })

  it('redirects if not logged in', () => {
    testLoggedIn(wrapper)
  })

  it('gets the list of composers', () => {
    testGetData(wrapper, 'getComposers')
  })

  it('shows error on get failure', () => {
    testGetDataFailed(wrapper, 'getComposers', 'Composers')
  })

  it('renders a modal with the form', () => {
    expect(wrapper.exists('Modal')).toBeTruthy()
    expect(wrapper.exists('ComposerForm')).toBeTruthy()
  })

  describe('createOrUpdate', () => {
    it('calls create action on new composer', () => {
      const born = new Date('1234')
      const died = new Date('1235')
      const newComposer = {
        name: 'test',
        era: 'Baroque',
        born: '1234-1-1',
        died: '1235-1-1'
      }
      const createComposer = jest.fn()
      const updateComposer = jest.fn()
      wrapper.setProps({ createComposer, updateComposer })
      wrapper.setProps({ createComposer })
      wrapper.instance().createOrUpdate(undefined, { ...newComposer, born, died })
      expect(createComposer).toHaveBeenCalledWith(testToken, { ...newComposer })
      expect(updateComposer).not.toHaveBeenCalled()
    })

    it('filters out null attributes', () => {
      const name = 'test'
      const era = 'baroque'
      const born = null
      const died = null
      const createComposer = jest.fn()
      const updateComposer = jest.fn()
      wrapper.setProps({ createComposer, updateComposer })
      wrapper.setProps({ createComposer })
      wrapper.instance().createOrUpdate(undefined, { name, era, born, died })
      expect(createComposer).toHaveBeenCalledWith(testToken, { name, era })
      expect(updateComposer).not.toHaveBeenCalled()
    })

    it('has required fields on create', () => {
      const createComposer = jest.fn()
      const updateComposer = jest.fn()
      wrapper.setProps({ createComposer, updateComposer })
      wrapper
        .instance()
        .createOrUpdate(null, { era: 'baroque', born: new Date('1234') })
      expect(wrapper.state().errors.name).toEqual('Name is required')
      expect(createComposer).not.toHaveBeenCalled()
      wrapper
        .instance()
        .createOrUpdate(null, { name: 'test', born: new Date('1234-1-1') })
      expect(wrapper.state().errors.name).toEqual('Era is required')
      expect(createComposer).not.toHaveBeenCalled()
    })

    it('calls update if id is passed', () => {
      const updateComposer = jest.fn()
      const createComposer = jest.fn()
      wrapper.setProps({ createComposer, updateComposer })
      wrapper.instance().createOrUpdate(1, { name: 'updated name' })
      expect(updateComposer).toHaveBeenCalledWith(testToken, 1, {
        name: 'updated name'
      })
      expect(createComposer).not.toHaveBeenCalled()
    })

    it('resets state on success', () => {
      const updateComposer = () => true
      wrapper.setState({ editID: 5, formOpen: true })
      wrapper.setProps({ updateComposer })
      wrapper.instance().createOrUpdate(5, { name: 'test', era: 'test' })
      expect(wrapper.state().formOpen).toBeFalsy()
      expect(wrapper.state().editID).toEqual(null)
    })

    it('returns errors on create failure', () => {
      const createComposer = () => false
      const errors = { someError: 'error' }
      wrapper.setState({ formOpen: true })
      wrapper.setProps({ createComposer, composers: { list: [], errors } })
      wrapper
        .instance()
        .createOrUpdate(null, { name: 'something ridiculous', era: 'fake' })
      expect(wrapper.state().formOpen).toBeTruthy()
      expect(wrapper.state().errors).toEqual(errors)
    })

    it('returns errors on update failure', () => {
      const updateComposer = () => false
      const errors = { someError: 'error' }
      wrapper.setState({ formOpen: true })
      wrapper.setProps({ updateComposer, composers: { list: [], errors } })
      wrapper
        .instance()
        .createOrUpdate(3, { name: 'something ridiculous', era: 'fake' })
      expect(wrapper.state().formOpen).toBeTruthy()
      expect(wrapper.state().errors).toEqual(errors)
    })
  })

  it('opens modal on create clicked', () => {
    expect(wrapper.contains('Create')).toBeTruthy()
    wrapper.find('a').simulate('click')
    expect(wrapper.state().formOpen).toBeTruthy()
  })
})

describe('ComposerItem', () => {
  let wrapper
  const composer = { name: 'Johann Sebastian Bach', era: 'Baroque' }

  beforeEach(() => {
    wrapper = shallow(
      <ComposerItem composer={{ name: '', era: '', id: 1 }} onDelete={jest.fn()} />
    )
  })

  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders a level', () => {
    expect(wrapper.exists('Level')).toBeTruthy()
  })

  it('renders a composer name with a link', () => {
    wrapper.setProps({ composer })
    expect(wrapper.contains(composer.name)).toBeTruthy()
    expect(wrapper.exists('Link')).toBeTruthy()
  })

  it('renders the dates if present', () => {
    wrapper.setProps({ composer: { ...composer, born: '1685', died: '1750' } })
    expect(wrapper.contains('(1685-1750)')).toBeTruthy()
  })

  it('deletes composer on click', () => {
    const onDelete = jest.fn()
    wrapper.setProps({ onDelete })
    wrapper.find('ItalicLink').simulate('click')
    expect(onDelete).toHaveBeenCalledWith(1)
  })
})

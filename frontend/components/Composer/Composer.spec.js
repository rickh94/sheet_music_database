import React from 'react'
import { shallow } from 'enzyme'
import '../../setupTests'

import {
  testToken,
  testLoggedIn,
  testGetData,
  testGetDataFailed
} from '../../testHelpers'

import { Composer } from './Composer'

describe('Composer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(
      <Composer
        alert={{ show: jest.fn() }}
        getComposer={jest.fn()}
        updateComposer={jest.fn()}
        token={testToken}
        match={{ params: { id: 1 } }}
        composers={{ composer: {} }}
        history={{ push: jest.fn() }}
      />
    )
  })

  it('matches the snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the header', () => {
    expect(wrapper.exists('Connect(Header)')).toBeTruthy()
  })

  it('renders a container', () => {
    expect(wrapper.exists('Container')).toBeTruthy()
  })

  it('renders a composer from props', () => {
    const composer = {
      id: 1,
      name: 'Test Name',
      born: '2018-01-02',
      died: '2018-01-03',
      era: 'test era',
      short_name: 'test'
    }
    wrapper.setProps({ composer })
    expect(wrapper.find('FieldDisplay').length).toEqual(5)
  })

  it('redirects if not logged in', () => {
    testLoggedIn(wrapper)
  })

  it('gets the composer', () => {
    testGetData(wrapper, 'getComposer', [1])
  })

  it('shows error on get failure', () => {
    testGetDataFailed(wrapper, 'getComposer', 'Composer')
  })

  it('calls updateComposer with updated data', () => {
    const updateComposer = jest.fn()
    wrapper.setProps({ token: 'testtoken', updateComposer })
    wrapper.instance().updateField('test', 'newValue')
    expect(updateComposer).toHaveBeenCalledWith('testtoken', 1, { test: 'newValue' })
  })

  it('sets errors in state on error', async () => {
    const updateComposer = (token, id, updated) => false
    const errors = { name: 'invalid name' }
    wrapper.setProps({ updateComposer, composers: { errors, composer: {} } })
    await wrapper.instance().updateField('test', 'test')
    expect(wrapper.state().errors).toEqual(errors)
  })
})

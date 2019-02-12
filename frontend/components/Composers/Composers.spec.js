import React from 'react'
import { shallow } from 'enzyme'
import { Composers, ComposerItem } from './Composers'
import '../../setupTests'
import { testLoggedIn, testGetData, testGetDataFailed } from '../../testHelpers';

describe('Composers', () => {
  const wrapper = shallow(
    <Composers
      composers={{ list: [] }}
      alert={{ show: jest.fn() }}
      getComposers={jest.fn()}
      token="sometesttoken"
      history={{push: jest.fn()}}
    />
  )

  beforeEach(() => {
    wrapper.update()
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
})

describe('ComposerItem', () => {
  const wrapper = shallow(<ComposerItem composer={{ name: '', era: '' }} />)
  const composer = { name: 'Johann Sebastian Bach', era: 'Baroque' }

  beforeEach(() => {
    wrapper.update()
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
})

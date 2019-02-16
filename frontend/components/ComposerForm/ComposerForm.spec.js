import React from 'react'
import { shallow } from 'enzyme'
import ComposerForm from './ComposerForm'
import { clickButton } from '../../testHelpers'
import '../../setupTests'

describe('ComposerForm', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(
      <ComposerForm errors={{}} onSubmit={jest.fn()} onCancel={jest.fn()} />
    )
  })

  it('renders a form', () => {
    expect(wrapper.exists('form')).toBeTruthy()
  })

  it('renders 3 text fields (name, era, short name)', () => {
    expect(wrapper.find('TextFieldWithErrors').length).toEqual(3)
  })

  it('renders 2 date pickers', () => {
    expect(wrapper.find('DatePicker').length).toEqual(2)
  })

  it('renders two buttons', () => {
    expect(wrapper.find('Button').length).toEqual(2)
  })

  it('calls passed in function on submit id', () => {
    const onSubmit = jest.fn()
    const id = 1
    const testData = {
      name: 'test',
      era: 'test',
      shortName: 'test',
      born: new Date(),
      died: new Date()
    }
    wrapper.setProps({ onSubmit, id })
    wrapper.setState({ ...testData })
    clickButton(wrapper, 'Submit')
    expect(onSubmit).toHaveBeenCalledWith(id, {
      name: testData.name,
      era: testData.era,
      shortName: testData.shortName,
      born: testData.born,
      died: testData.died
    })
  })

  it('calls passed in function on submit with no id', () => {
    const onSubmit = jest.fn()
    const testData = {
      name: 'test',
      era: 'test',
      shortName: 'test',
      born: new Date(),
      died: new Date()
    }
    wrapper.setProps({ onSubmit })
    wrapper.setState({ ...testData })
    clickButton(wrapper, 'Submit')
    expect(onSubmit).toHaveBeenCalledWith(undefined, {
      name: testData.name,
      era: testData.era,
      shortName: testData.shortName,
      born: testData.born,
      died: testData.died
    })
  })

  it('calls passed in function on cancel', () => {
    const onCancel = jest.fn()
    wrapper.setProps({ onCancel })
    clickButton(wrapper, 'Cancel')
    expect(onCancel).toHaveBeenCalled()
  })

  it('renders the correct title', () => {
    expect(wrapper.contains('Create Composer')).toBeTruthy()
    wrapper.setProps({ id: 1 })
    expect(wrapper.contains('Edit Composer')).toBeTruthy()
  })
})

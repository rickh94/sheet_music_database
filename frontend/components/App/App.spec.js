import React from 'react'
import { shallow } from 'enzyme'
import App from './App'
import '../../setupTests'

describe('App', () => {
	const wrapper = shallow(<App />)
	it('renders a div', () => {
		expect(wrapper.find('div').length).toEqual(1)
	})
})

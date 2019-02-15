import React from 'react'

export const testToken = 'testtoken'

export function testLoggedIn(wrapper) {
  const history = { push: jest.fn() }
  const token = null
  const alert = { show: jest.fn() }
  wrapper.setProps({ token, history, alert })
  wrapper.instance().componentDidMount()
  expect(history.push).toHaveBeenCalledWith('/login')
  expect(alert.show).toHaveBeenCalledWith(
    <span className="alert-text">Please log in</span>,
    { type: 'error' }
  )
}

export function testGetData(wrapper, functionPropName) {
  const getFunction = jest.fn()
  wrapper.setProps({ [functionPropName]: getFunction, token: testToken })
  wrapper.instance().componentDidMount()
  expect(getFunction).toHaveBeenCalledWith(testToken)
}

export function testGetDataFailed(wrapper, functionPropName, nameInMessage) {
  const getFunction = () => false
  const alert = { show: jest.fn() }
  wrapper.setProps({ [functionPropName]: getFunction, token: testToken, alert })
  wrapper.instance().componentDidMount()
  expect(alert.show).toHaveBeenCalledWith(
    <span className="alert-text">{`Could not get ${nameInMessage}`}</span>,
    { type: 'error' }
  )
}

export function clickButton(wrapper, name) {
  wrapper
    .findWhere(el => el.name() == 'Button' && el.contains(name))
    .simulate('click', { preventDefault: jest.fn() })
}

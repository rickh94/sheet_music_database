import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import 'normalize.css'

import stuff from '../../reducers'
import Routes from '../Routes'
import './App.scss'

const store = createStore(stuff, applyMiddleware(thunk))

const alertOptions = {
  position: 'bottom left',
  timeout: 3000,
  offset: '30px',
  transition: 'fade'
}

export default class App extends Component {
  async componentDidMount() {}
  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Routes />
        </AlertProvider>
      </Provider>
    )
  }
}

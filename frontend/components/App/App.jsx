import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import 'normalize.css'

import stuff from '../../reducers'
import Home from '../Home'
import Login from '../Login'
import Logout from '../Logout'
import NotFound from '../NotFound'
import Profile from '../Profile'

import './App.scss'
import Register from '../Register'

const store = createStore(stuff, applyMiddleware(thunk))

library.add(faUser)
library.add(faUserPlus)

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
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route default component={NotFound} />
            </Switch>
          </BrowserRouter>
        </AlertProvider>
      </Provider>
    )
  }
}

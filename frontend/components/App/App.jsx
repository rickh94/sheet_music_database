import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import 'normalize.css'

import stuff from '../../reducers'
import Home from '../Home'
import Login from '../Login'
import Logout from '../Logout'
import NotFound from '../NotFound'
import Profile from '../Profile'
import Register from '../Register'
import Tags from '../Tags'
import Composers from '../Composers'
import Composer from '../Composer'

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
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/tags" component={Tags} />
              <Route exact path="/composers" component={Composers} />
              <Route exact path="/composer/:id" component={Composer} />
              <Route default component={NotFound} />
            </Switch>
          </BrowserRouter>
        </AlertProvider>
      </Provider>
    )
  }
}

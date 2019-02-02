import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import 'normalize.css'

import stuff from '../../reducers'
import Home from '../Home'
import Login from '../Login'
import NotFound from '../NotFound'

import './App.scss'

let store = createStore(stuff, applyMiddleware(thunk))

library.add(faUser)
library.add(faUserPlus)

export default class App extends Component {
  async componentDidMount() {}
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route default component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import { connect } from 'react-redux'
import { account } from '../../actions'
import Loadable from 'react-loadable'

import Home from '../Home'

const Login = Loadable({
  loader: () => import('../Login'),
  loading: () => <div>Loading...</div>
})
const Logout = Loadable({
  loader: () => import('../Logout'),
  loading: () => <div>Loading...</div>
})
const NotFound = Loadable({
  loader: () => import('../NotFound'),
  loading: () => <div>Loading...</div>
})
const Profile = Loadable({
  loader: () => import('../Profile'),
  loading: () => <div>Loading...</div>
})
const Register = Loadable({
  loader: () => import('../Register'),
  loading: () => <div>Loading...</div>
})
const Tags = Loadable({
  loader: () => import('../Tags'),
  loading: () => <div>Loading...</div>
})
const Composers = Loadable({
  loader: () => import('../Composers'),
  loading: () => <div>Loading...</div>
})
const Composer = Loadable({
  loader: () => import('../Composer'),
  loading: () => <div>Loading...</div>
})


export class Routes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticating: true
    }
  }

  static propTypes = {
    attemptLogin: PropTypes.func.isRequired
  }

  async componentDidMount() {
    const token = localStorage.getItem('token')
    if (token) {
      await this.props.attemptLogin(token)
    }
    this.setState({ isAuthenticating: false })
  }

  render() {
    return (
      !this.state.isAuthenticating && (
        <Router>
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
        </Router>
      )
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    attemptLogin: token => {
      return dispatch(account.checkToken(token))
    }
  }
}

export default connect(
  undefined,
  mapDispatchToProps
)(Routes)

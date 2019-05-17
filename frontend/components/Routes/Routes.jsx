import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import { connect } from 'react-redux'
import { account } from '../../actions'
import Loadable from 'react-loadable'
import { List } from 'react-content-loader'
import Box from 'react-bulma-components/lib/components/box'

import Home from '../Home'
import Header from '../Header'
import Container from 'react-bulma-components/lib/components/container/container'

function LoadingScreen(props) {
  return (
    <React.Fragment>
      <Header />
      <Container>
        <Box className="margin-default">
          <List />
        </Box>
      </Container>
    </React.Fragment>
  )
}

const Login = Loadable({
  loader: () => import('../Login'),
  loading: () => <LoadingScreen />
})
const Logout = Loadable({
  loader: () => import('../Logout'),
  loading: () => <LoadingScreen />
})
const NotFound = Loadable({
  loader: () => import('../NotFound'),
  loading: () => <LoadingScreen />
})
const Profile = Loadable({
  loader: () => import('../Profile'),
  loading: () => <LoadingScreen />
})
const Register = Loadable({
  loader: () => import('../Register'),
  loading: () => <LoadingScreen />
})
const Tags = Loadable({
  loader: () => import('../Tags'),
  loading: () => <LoadingScreen />
})
const Composers = Loadable({
  loader: () => import('../Composers'),
  loading: () => <LoadingScreen />
})
const Composer = Loadable({
  loader: () => import('../Composer'),
  loading: () => <LoadingScreen />
})
const Instruments = Loadable({
  loader: () => import('../Instruments'),
  loading: () => <LoadingScreen />
})
const Sheets = Loadable({
  loader: () => import('../Sheets'),
  loading: () => <LoadingScreen />
})
const Sheet = Loadable({
  loader: () => import('../Sheet'),
  loading: () => <LoadingScreen />
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
            <Route exact path="/instruments" component={Instruments} />
            <Route exact path="/sheets" component={Sheets} />
            <Route exact path="/sheets/:id" component={Sheet} />
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

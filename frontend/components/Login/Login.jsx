import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withAlert } from 'react-alert'

import Container from 'react-bulma-components/lib/components/container'
import {
  Field,
  Control,
  Checkbox,
} from 'react-bulma-components/lib/components/form'
import Button from 'react-bulma-components/lib/components/button'
import Card from 'react-bulma-components/lib/components/card'
import Content from 'react-bulma-components/lib/components/card/components/content'
import Notification from 'react-bulma-components/lib/components/notification'

import Header from '../Header'
import TextFieldWithErrors from '../TextFieldWithErrors'
import { account } from '../../actions'
import alertText from '../../middleware/alertText'

export class LoginWrapper extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
    alert: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired
  }

  componentDidMount() {
    if (this.props.account.token) {
      this.props.alert.show(alertText('Already Logged In'))
      this.props.history.goBack()
    }
  }

  attemptLogin = async (email, password, remember) => {
    let success
    try {
      success = await this.props.login(email, password, remember)
    } catch (err) {
      success = false
    }
    if (success) {
      this.props.alert.show(alertText('Login Successful'), { type: 'success' })
      this.props.history.goBack()
    } else {
      this.props.alert.show(alertText('Login Failed'), { type: 'error' })
      return this.props.account.errors
    }
  }

  render() {
    return (
      // Perhaps refactor to be centered fixed width
      <React.Fragment>
        <Header />
        <Container>
          <Card className="margin-default">
            <Card.Header>
              <Card.Header.Title>Login</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <LoginForm attemptLogin={this.attemptLogin} cancel={() => this.props.history.goBack()} />
              <Content>
                <Link to="/register">Don{"'"}t have an account? Register Here</Link>
              </Content>
            </Card.Content>
          </Card>
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: state.account
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (email, password, remember) => {
      return dispatch(account.login(email, password, remember))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(LoginWrapper))

export class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    remember: false,
    errors: {
      email: null,
      password: null,
      nonFieldErrors: null
    }
  }

  static propTypes = {
    attemptLogin: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired
  }

  onCancelClicked = () => {
    this.props.cancel()
  }

  onFieldChange = (e, name) => {
    this.setState({ [name]: e.target.value })
  }

  onLoginClicked = async e => {
    e.preventDefault()
    const { email, password, remember } = this.state
    if (!email) {
      this.setState({ errors: { email: 'Email is required' } })
      return
    }
    if (!password) {
      this.setState({ errors: { password: 'Password is required' } })
      return
    }
    const loginErrors = await this.props.attemptLogin(email, password, remember)
    if (loginErrors) {
      this.setState({
        errors: {
          email: loginErrors.email,
          password: loginErrors.password,
          nonFieldErrors: loginErrors.non_field_errors
        }
      })
    }
  }

  render() {
    const { email, password, remember, errors } = this.state
    return (
      <form>
        {errors.nonFieldErrors && (
          <Notification color="danger">
            {errors.nonFieldErrors}
            <Button
              remove
              onClick={() => this.setState({ errors: { nonFieldErrors: null } })}
            />
          </Notification>
        )}
        <TextFieldWithErrors
          label="Email"
          placeholder="Enter Email..."
          value={email}
          type="email"
          onChange={this.onFieldChange}
          error={errors.email}
          name="email"
        />
        <TextFieldWithErrors
          label="Password"
          placeholder="Enter Password..."
          value={password}
          type="password"
          error={errors.password}
          name="password"
          onChange={this.onFieldChange}
        />
        <Field>
          <Control>
            <Checkbox
              onChange={() => this.setState({ remember: !remember })}
              checked={remember}
            >
              {' '}
              Keep Me Logged In
            </Checkbox>
          </Control>
        </Field>
        <Field kind="group">
          <Control>
            <Button type="primary" onClick={e => this.onLoginClicked(e)}>
              Login
            </Button>
          </Control>
          <Control>
            <Button onClick={() => this.onCancelClicked()}>Cancel</Button>
          </Control>
        </Field>
      </form>
    )
  }
}

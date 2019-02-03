import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Header from '../Header/Header'

import { app } from '../../actions'

import Container from 'react-bulma-components/lib/components/container'
import {
  Field,
  Label,
  Control,
  Input,
  Checkbox
} from 'react-bulma-components/lib/components/form'
import Button from 'react-bulma-components/lib/components/button'
import Card from 'react-bulma-components/lib/components/card'
import Content from 'react-bulma-components/lib/components/card/components/content'

export class LoginWrapper extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    login: PropTypes.func.isRequired
  }

  attemptLogin = async (email, password, remember) => {
    await this.props.login(email, password, remember)
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
              <LoginForm attemptLogin={this.attemptLogin} />
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

export class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    remember: false,
    errors: {}
  }

  static propTypes = {
    attemptLogin: PropTypes.func.isRequired
  }
  // onLoginClicked() {}

  onCancelClicked() {}

  onFieldChange(e, name) {
    this.setState({ [name]: e.target.value })
  }

  onLoginClick = e => {
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
    this.props.attemptLogin(email, password, remember)
  }

  render() {
    const { email, password, remember } = this.state
    return (
      <form>
        <Field>
          <Label>Email</Label>
          <Control>
            <Input
              type="email"
              placeholder="Enter Email..."
              value={email}
              onChange={e => this.onFieldChange(e, 'email')}
            />
          </Control>
        </Field>
        <Field>
          <Label>Password</Label>
          <Control>
            <Input
              type="password"
              placeholder="Enter Password..."
              value={password}
              onChange={e => this.onFieldChange(e, 'password')}
            />
          </Control>
        </Field>
        <Field>
          <Control>
            <Checkbox
              onChange={e => this.setState({ remember: !remember })}
              checked={remember}
            >
              {' '}
              Remember Me
            </Checkbox>
          </Control>
        </Field>
        <Field kind="group">
          <Control>
            <Button type="primary" onClick={e => this.onLoginClick(e)}>
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

const mapStateToProps = () => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    login: (email, password, remember) => {
      return dispatch(app.login(email, password, remember))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginWrapper)

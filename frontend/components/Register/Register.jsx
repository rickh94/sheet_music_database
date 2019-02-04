import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Container from 'react-bulma-components/lib/components/container'
import Card from 'react-bulma-components/lib/components/card/card'
import {
  Field,
  Label,
  Control,
  Input,
  Checkbox
} from 'react-bulma-components/lib/components/form'
import Notification from 'react-bulma-components/lib/components/notification'
import Button from 'react-bulma-components/lib/components/button'
import { withAlert } from 'react-alert'
import { connect } from 'react-redux'

import Header from '../Header'
import alertText from '../../middleware/alertText'
import TextFieldWithErrors from '../TextFieldWithErrors'
import {app} from '../../actions'

export class Register extends Component {
  componentDidMount() {
    if (this.props.app.token) {
      this.props.alert.show(alertText('Already Logged In'))
      this.props.history.goBack()
    }
  }

  static propTypes = {
    app: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
  }

  attemptRegister = async (email, password1, password2, remember) => {
    let success
    try {
      success = await this.props.register(email, password1, password2, remember)
    } catch (err) {
      success = false
    }
    if (success) {
      this.props.alert.show(alertText('Registration Successful'), { type: 'success' })
      this.props.history.goBack()
    } else {
      this.props.alert.show(alertText('Registration Failed'), { type: 'error' })
      return this.props.app.errors
    }

  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Card className="margin-default">
            <Card.Header>
              <Card.Header.Title>Register</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <RegistrationForm attemptRegister={this.attemptRegister} />
            </Card.Content>
          </Card>
        </Container>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    register: (email, password1, password2, remember) => {
      return dispatch(app.register(email, password1, password2, remember))
    }
  }
}

const mapStateToProps = state => {
  return {
    app: state.app
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Register))

export class RegistrationForm extends Component {
  state = {
    email: '',
    password1: '',
    password2: '',
    remember: false,
    errors: {
      email: null,
      password1: null,
      password2: null,
      nonFieldErrors: null
    }
  }
  
  static propTypes = {
    attemptRegister: PropTypes.func.isRequired,
  }

  onRegisterClicked = async e => {
    e.preventDefault()
    const { email, password1, password2, remember } = this.state
    if (!email) {
      this.setState({errors: {email: 'Email is required'}})
      return
    }
    if (!password1) {
      this.setState({errors: {password1: 'Password is required'}})
      return
    }
    if (password2 !== password1) {
      this.setState({errors: {password2: 'Passwords need to match'}})
      return
    }
    const registrationErrors = await this.props.attemptRegister(email, password1, password2, remember)
    if (registrationErrors) {
      this.setState({
        errors: {
          email: registrationErrors.email,
          password1: registrationErrors.password1,
          password2: registrationErrors.password2,
          nonFieldErrors: registrationErrors.non_field_errors
        }
      })
    }
  }
  onCancelClicked() {}

  onFieldChange = (e, name) => {
    this.setState({ [name]: e.target.value })
  }

  render() {
    const { remember, email, password1, password2, errors } = this.state
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
          name="email"
          error={errors.email}
        />
        <TextFieldWithErrors
          label="Password"
          placeholder="Enter Password..."
          value={password1}
          type="password"
          onChange={this.onFieldChange}
          name="password1"
          error={errors.password1}
        />
        <TextFieldWithErrors
          label="Confirm Password"
          placeholder="Confirm Password..."
          value={password2}
          type="password"
          onChange={this.onFieldChange}
          name="password2"
          error={errors.password2}
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
        <Field type="group">
          <Control>
            <Button type="primary" onClick={e => this.onRegisterClicked(e)}>
              Register
            </Button>
            <Button onClick={() => this.onCancelClicked()}>Cancel</Button>
          </Control>
        </Field>
      </form>
    )
  }
}

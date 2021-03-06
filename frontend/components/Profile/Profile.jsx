import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withAlert } from 'react-alert'

import Container from 'react-bulma-components/lib/components/container/container'
import Card from 'react-bulma-components/lib/components/card'
import Button from 'react-bulma-components/lib/components/button'
import { Field, Control } from 'react-bulma-components/lib/components/form'
import Modal from 'react-bulma-components/lib/components/modal'
import Heading from 'react-bulma-components/lib/components/heading'
import Section from 'react-bulma-components/lib/components/section'
import Box from 'react-bulma-components/lib/components/box'
import Content from 'react-bulma-components/lib/components/content'

import Header from '../Header'
import TextFieldWithErrors from '../TextFieldWithErrors'
import { account } from '../../actions'
import alertText, { messages } from '../../middleware/alertText'

import './Profile.scss'
import FieldDisplay from '../FieldDisplay'
import { getDataOrLogIn } from '../../helpers'

export class Profile extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    errors: {
      firstName: null,
      lastName: null,
      email: null,
      username: null
    },
    passwordChangeErrors: {
      password1: null,
      password2: null
    },
    changePasswordOpen: false
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    getProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    alert: PropTypes.object.isRequired,
    changePassword: PropTypes.func.isRequired
  }

  componentDidMount() {
    getDataOrLogIn(
      this.props.account.token,
      this.props.alert,
      this.props.history,
      this.props.getProfile,
      'profile information'
    )
  }

  updateField = async (fieldName, data) => {
    const success = await this.props.updateProfile(this.props.account.token, {
      [fieldName]: data
    })
    if (success) {
      this.props.alert.show(alertText('Profile Updated'), { type: 'success' })
    } else {
      this.props.alert.show(alertText('Could not save profile information'), {
        type: 'error'
      })
    }
  }

  changePassword = async (password1, password2) => {
    if (password1 !== password2) {
      this.setState({ passwordChangeErrors: { password2: 'Passwords must match' } })
      return
    }
    const success = await this.props.changePassword(
      this.props.account.token,
      password1,
      password2
    )
    if (success) {
      this.props.alert.show(alertText('Password Changed'), { type: 'success' })
      this.setState({ changePasswordOpen: false })
    } else {
      this.props.alert.show(alertText('Password Change Failed'), { type: 'error' })
    }
  }

  render() {
    const { first_name, last_name, email, username } = this.props.account.profile
    const { errors } = this.state
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Box className="margin-default">
            <Heading className="absolutely-no-margin">Profile</Heading>
            <br/>
            <div style={{ paddingBottom: '0.8rem' }}>
              <strong>Email</strong>
              <br />
              {email}
            </div>
            <FieldDisplay
              label="First Name"
              value={first_name}
              backendFieldName="first_name"
              errors={errors.firstName}
              saveCallback={this.updateField}
            />
            <FieldDisplay
              label="Last Name"
              value={last_name}
              backendFieldName="last_name"
              errors={errors.lastName}
              saveCallback={this.updateField}
            />
            <FieldDisplay
              label="Username"
              value={username}
              backendFieldName="username"
              errors={errors.email}
              saveCallback={this.updateField}
            />
            <br />
            <Button
              onClick={() => {
                this.setState({ changePasswordOpen: true })
              }}
            >
              Change Password
            </Button>
          </Box>
        </Container>
        <Modal
          show={this.state.changePasswordOpen}
          onClose={() => this.setState({ changePasswordOpen: false })}
          closeOnBlur
        >
          <Modal.Content>
            <PasswordChangeForm
              errors={this.state.passwordChangeErrors}
              onSubmit={this.changePassword}
              onCancel={() => this.setState({ changePasswordOpen: false })}
            />
          </Modal.Content>
        </Modal>
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
    getProfile: token => {
      return dispatch(account.getProfile(token))
    },

    updateProfile: (token, data) => {
      return dispatch(account.updateProfile(token, data))
    },

    changePassword: (token, password1, password2) => {
      return dispatch(account.changePassword(token, password1, password2))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Profile))

export class PasswordChangeForm extends Component {
  state = {
    password1: '',
    password2: ''
  }

  render() {
    const { password1, password2 } = this.state
    return (
      <React.Fragment>
        <Box style={{ backgroundColor: 'white' }}>
          <Heading size={6}>Change Password</Heading>
          <form className="form-padding">
            <TextFieldWithErrors
              label="New Password"
              type="password"
              onChange={e => this.setState({ password1: e.target.value })}
              error={this.props.errors.password1}
              name=""
              placeholder="New Password"
              value={password1}
            />
            <TextFieldWithErrors
              label="Confirm New Password"
              type="password"
              onChange={e => this.setState({ password2: e.target.value })}
              error={this.props.errors.password2}
              name=""
              placeholder="Confirm New Password"
              value={password2}
            />
            <Field type="group">
              <Control>
                <Button
                  type="primary"
                  onClick={e => {
                    e.preventDefault()
                    this.props.onSubmit(password1, password2)
                  }}
                >
                  Submit
                </Button>
                <Button onClick={this.props.onCancel}>Cancel</Button>
              </Control>
            </Field>
          </form>
        </Box>
      </React.Fragment>
    )
  }
}

PasswordChangeForm.propTypes = {
  errors: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withAlert } from 'react-alert'

import Container from 'react-bulma-components/lib/components/container/container'
import Card from 'react-bulma-components/lib/components/card'
import Button from 'react-bulma-components/lib/components/button'
import { Field, Control } from 'react-bulma-components/lib/components/form'

import Header from '../Header'
import TextFieldWithErrors from '../TextFieldWithErrors'
import { account } from '../../actions'
import alertText, { messages } from '../../middleware/alertText'

import './Profile.scss'

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
    }
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    getProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    alert: PropTypes.object.isRequired
  }

  async componentDidMount() {
    if (!this.props.account.token) {
      this.props.alert.show(messages.notLoggedIn, { type: 'error' })
      this.props.history.push('/login')
    } else {
      const success = this.props.getProfile(this.props.account.token)
      if (!success) {
        this.props.alert.show(alertText('Could not get profile information'), {
          type: 'error'
        })
        this.props.history.goBack()
      }
    }
  }

  updateField = async (fieldName, data) => {
    const success = await this.props.updateProfile(this.props.account.token, {
      [fieldName]: data
    })
    if (!success) {
      this.props.alert.show(
        alertText('Could not save profile information', { type: 'error' })
      )
    }
  }

  render() {
    const { first_name, last_name, email, username } = this.props.account.profile
    const { errors } = this.state
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Card className="margin-default">
            <Card.Header>
              <Card.Header.Title>Profile</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <div style={{ paddingBottom: '0.8rem' }}>
                <strong>Email:</strong> {email}
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
              <Button>Change Password</Button>
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
    getProfile: token => {
      return dispatch(account.getProfile(token))
    },

    updateProfile: (token, data) => {
      return dispatch(account.updateProfile(token, data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Profile))

export class FieldDisplay extends Component {
  constructor(props) {
    super(props)
  }
  state = { newValue: '' }

  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    saveCallback: PropTypes.func.isRequired,
    backendFieldName: PropTypes.string.isRequired,
    errors: PropTypes.any
  }

  componentDidMount() {
    this.setState({ newValue: this.props.value })
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props
    if (oldProps.value != newProps.value) {
      this.setState({ newValue: newProps.value })
    }
  }

  render() {
    const { edit, newValue, errors } = this.state
    return (
      <div style={{ ...this.props.style, paddingBottom: '0.8rem' }}>
        <strong>{this.props.label}:</strong>{' '}
        {this.state.edit ? (
          <React.Fragment>
            <TextFieldWithErrors
              type="text"
              value={newValue}
              onChange={e => this.setState({ newValue: e.target.value })}
              error={errors}
              name=""
            />
            <Field type="group">
              <Control>
                <Button
                  onClick={() => {
                    this.props.saveCallback(this.props.backendFieldName, newValue)
                    this.setState({ edit: false })
                  }}
                >
                  Save
                </Button>
                <Button
                  onClick={() =>
                    this.setState({ edit: false, newValue: this.props.value })
                  }
                >
                  Cancel
                </Button>
              </Control>
            </Field>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {this.props.value}
            {'  '}
            <a
              className="edit-link"
              id="edit-first-name"
              onClick={() => this.setState({ edit: true })}
            >
              edit
            </a>
          </React.Fragment>
        )}
      </div>
    )
  }
}

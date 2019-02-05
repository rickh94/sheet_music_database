import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Container from 'react-bulma-components/lib/components/container/container'
import Card from 'react-bulma-components/lib/components/card'
import Button from 'react-bulma-components/lib/components/button'
import { Field, Control } from 'react-bulma-components/lib/components/form'

import Header from '../Header'
import TextFieldWithErrors from '../TextFieldWithErrors'

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

  hoverEditButton = e => {
    e.target.classList.add('edit-hover')
  }

  render() {
    const { firstName, lastName, email, username, errors } = this.state
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Card className="margin-default">
            <Card.Header>
              <Card.Header.Title>Profile</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <FieldDisplay
                label="First Name"
                value={firstName}
                backendFieldName="first_name"
                errors={errors.firstName}
                saveCallback={() => {}}
              />
              <FieldDisplay
                label="Last Name"
                value={lastName}
                backendFieldName="last_name"
                errors={errors.lastName}
                saveCallback={() => {}}
              />
              <FieldDisplay
                label="Email"
                value={email}
                backendFieldName="email"
                errors={errors.email}
                saveCallback={() => {}}
              />
              <FieldDisplay
                label="Username"
                value={username}
                backendFieldName="username"
                errors={errors.email}
                saveCallback={() => {}}
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

Profile.propTypes = {
  account: PropTypes.object.isRequired
}

export default Profile

export class FieldDisplay extends Component {
  constructor(props) {
    super(props)
    this.state = { edit: false, newValue: props.value }
  }
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    saveCallback: PropTypes.func.isRequired,
    backendFieldName: PropTypes.string.isRequired,
    errors: PropTypes.any
  }

  render() {
    const { edit, newValue, errors } = this.state
    return (
      <div style={{...this.props.style, paddingBottom: '0.8rem'}}>
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

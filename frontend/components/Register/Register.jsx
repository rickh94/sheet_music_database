import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'
import Container from 'react-bulma-components/lib/components/container'
import Card from 'react-bulma-components/lib/components/card/card'
import { Field, Label, Control, Input } from 'react-bulma-components/lib/components/form'
import Button from 'react-bulma-components/lib/components/button'

class Register extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Card>
            <Card.Header>
              <Card.Header.Title>Register</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <RegistrationForm />
            </Card.Content>
          </Card>
        </Container>
      </React.Fragment>
    )
  }
}

Register.propTypes = {}

export default Register

export class RegistrationForm extends Component {
  render() {
    return (
      <form>
        <Field>
          <Label>Email</Label>
          <Control>
            <Input type="email" placeholder="Enter email..." />
          </Control>
        </Field>
        <Field>
          <Label>Password</Label>
          <Control>
            <Input type="password" placeholder="Enter password.." />
          </Control>
        </Field>
        <Field>
          <Label>Confirm Password</Label>
          <Control>
            <Input type="password" placeholder="Confirm password..." />
          </Control>
        </Field>
        <Field type="group">
          <Control>
            <Button type="primary">Register</Button>
          </Control>
          <Control>
            <Button>Cancel</Button>
          </Control>
        </Field>
      </form>
    )
  }
}

import React, { Component } from 'react'
import Header from '../Header/Header'

import Container from 'react-bulma-components/lib/components/container'
import { Field, Label, Control, Input } from 'react-bulma-components/lib/components/form'
import Button from 'react-bulma-components/lib/components/button'
import Card from 'react-bulma-components/lib/components/card'

export default class Login extends Component {
  render() {
    return (
      // Perhaps refactor to be centered fixed width
      // TODO: add link to register new users
      <React.Fragment>
        <Header />
        <Container>
          <Card className="margin-default">
            <Card.Content>
              <LoginForm />
            </Card.Content>
          </Card>
        </Container>
      </React.Fragment>
    )
  }
}

export class LoginForm extends Component {
  onLoginClicked() {}

  onCancelClicked() {}

  render() {
    return (
      <form>
        <Field>
          <Label>Email</Label>
          <Control>
            <Input type="email" placeholder="Enter Email..." />
          </Control>
        </Field>
        <Field>
          <Label>Password</Label>
          <Control>
            <Input type="password" placeholder="Enter Password..." />
          </Control>
        </Field>
        <Field kind="group">
          <Control>
            <Button type="primary" onClick={() => this.onLoginClicked()}>
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

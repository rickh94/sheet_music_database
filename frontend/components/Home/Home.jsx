import React, { Component } from 'react'
import { Card, Columns, Container, Button } from 'react-bulma-components/full'

export default class Home extends Component {
  render() {
    return (
      <div>
        <Container fluid>
          <Columns>
            <Columns.Column>
              <Card color="danger">
                <h1>Hi</h1>
                <Card.Footer>
                  <Card.Footer.Item renderAs="a" href="#yes">
                    Yes
                  </Card.Footer.Item>
                </Card.Footer>
              </Card>
            </Columns.Column>
            <Columns.Column>
              <Card color="blue">
                <h1>There</h1>
              </Card>
            </Columns.Column>
          </Columns>
        </Container>
      </div>
    )
  }
}

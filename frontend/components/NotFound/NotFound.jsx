import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'

import Container from 'react-bulma-components/lib/components/container'
import Card from 'react-bulma-components/lib/components/card/card'
import Heading from 'react-bulma-components/lib/components/heading'

class NotFound extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Card className="margin-default">
            <Card.Header>
              <Card.Header.Title>
                <Heading size={5} className='no-margin-padding'>Not Found</Heading>
              </Card.Header.Title>
            </Card.Header>
            <Card.Content>The page you are looking for could not be found</Card.Content>
          </Card>
        </Container>
      </React.Fragment>
    )
  }
}

NotFound.propTypes = {}

export default NotFound

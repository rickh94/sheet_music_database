import React, { Component } from 'react'
import Card from 'react-bulma-components/lib/components/card'
import Columns from 'react-bulma-components/lib/components/columns'
import Container from 'react-bulma-components/lib/components/container'
import Heading from 'react-bulma-components/lib/components/heading'
import Box from 'react-bulma-components/lib/components/box'

import backgroundImage from './background.jpg'
import './Home.scss'

import Header from '../Header/Header'

const background = {
  // backgroundRepeat: 'no-repeat',
  // backgroundAttachment: 'fixed',
  position: 'absolute',
  top: '0px',
  left: '0px',
  // backgroundSize: 'cover',
  width: '100vw',
  height: '100vh',
  filter: 'blur(1px) opacity(20%) grayscale(5)',
  zIndex: 1
}

export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Card color="white" className="foreground title-card mostly-opaque">
            <Card.Content>
              <Heading size={3} spaced={true} style={{ paddingLeft: '1vw' }}>
                Rick's <span className="has-text-primary">Sheet Music</span> Database
              </Heading>
            </Card.Content>
          </Card>
        </Container>
        <img style={background} src={backgroundImage} />
      </React.Fragment>
    )
  }
}

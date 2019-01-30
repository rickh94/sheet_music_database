import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Card from 'react-bulma-components/lib/components/card'
import Container from 'react-bulma-components/lib/components/container'
import Heading from 'react-bulma-components/lib/components/heading'
import Content from 'react-bulma-components/lib/components/content'
import Box from 'react-bulma-components/lib/components/box'
import Section from 'react-bulma-components/lib/components/section'

import backgroundImage from './background.jpg'
import './Home.scss'
import Header from '../Header/Header'

const background = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  width: '100vw',
  height: '100vh',
  filter: 'blur(1px) opacity(5%) grayscale(6)',
  zIndex: 1
}

export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Header />
        <Container className="foreground">
          <Card color="white" className="margin-default mostly-opaque">
            <Card.Content style={{ paddingTop: '1vh' }}>
              <Heading size={3}>Sheet Music Database</Heading>
              <Heading subtitle={true}>Organize your sheet music</Heading>
              <Content>Organize your sheet music by Piece, with Composers, Tags, and Instruments.</Content>
            </Card.Content>
            <Card.Footer>
              <Card.Footer.Item>
                <Link to="/login" className="card--link">
                  Login
                </Link>
              </Card.Footer.Item>
              <Card.Footer.Item>
                <Link to="/register" className="card--link">
                  Register
                </Link>
              </Card.Footer.Item>
            </Card.Footer>
          </Card>
          <br />
          <Heading size={4} className="margin-default">
            Organization
          </Heading>
          <Card className="margin-default description-card">
            <Card.Header>
              <Card.Header.Title>Piece</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <Content>
                Everything is organized into pieces which have:
                <ul>
                  <li>Composer(s): The composer of the piece</li>
                  <li>Sheets: The individual sheet music files that correspond to the piece</li>
                  <li>Tags: Arbitrary tags for categorizing pieces</li>
                  <li>Instruments: All the instruments connected with a piece{"'"}s sheets</li>
                </ul>
                This provides one place for all the data about a piece can be found, while still having separate data
                that can be filtered in other ways
              </Content>
            </Card.Content>
          </Card>
          <Card className="margin-default description-card">
            <Card.Header>
              <Card.Header.Title>Composer</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <Content>
                Composers are separate objects from Pieces so that multiple pieces can share the same composer and you
                can easily see all pieces associated with a composer. It holds all the data about a composer, such as
                their name, birth/death dates, and the era/style of their compositions.
              </Content>
            </Card.Content>
          </Card>
          <Card className="margin-default description-card">
            <Card.Header>
              <Card.Header.Title>Sheet</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <Content>
                A Sheet is actual sheet music with an associated file. It holds all the data about the file, such as the
                instrument(s) in the sheet, the file format, and what type of sheet it is (e.g. score, part,
                manuscript), as well as being able to get the file itself.
              </Content>
            </Card.Content>
          </Card>
          <Card className="margin-default description-card">
            <Card.Header>
              <Card.Header.Title>Tag</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              <Content>
                A Tag (like in many apps) is any arbitrary text to be associated with a piece to descibe its attributes
                and associate it with other pieces with those attributes.
              </Content>
            </Card.Content>
          </Card>
        </Container>
        <img style={background} src={backgroundImage} />
      </React.Fragment>
    )
  }
}

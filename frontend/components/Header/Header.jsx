import React, { Component } from 'react'
import Navbar from 'react-bulma-components/lib/components/navbar'
import Heading from 'react-bulma-components/lib/components/heading'
import { Link } from 'react-router-dom'
import './Header.scss'

export default class Header extends Component {
  state = {
    open: false
  }

  render() {
    const { open } = this.state
    return (
      <Navbar color="primary" textColor="light">
        <Navbar.Brand textColor="white" renderAs="div" paddingless={true} marginless={true}>
          <Link to="/" className="header--link">
            <Navbar.Item renderAs="span" paddingless={true} marginless={true} style={{ height: '70%' }}>
              <Heading
                size={5}
                renderAs="div"
                style={{ verticalAlign: 'middle', color: '#f0f0f0' }}
                marginless={true}
                paddingless={true}
              >
                Sheet Music Database
              </Heading>
            </Navbar.Item>
          </Link>
          <Navbar.Burger
            className={open && 'is-active'}
            paddingless={true}
            marginless={true}
            onClick={() => this.setState({ open: !open })}
          />
        </Navbar.Brand>
        <Navbar.Menu className={open && 'is-active'} color="primary">
          <Navbar.Container color="primary" position="end">
            <Link to="/" className="header--link">
              <Navbar.Item renderAs="div">
                Home
              </Navbar.Item>
            </Link>
          </Navbar.Container>
        </Navbar.Menu>
      </Navbar>
    )
  }
}

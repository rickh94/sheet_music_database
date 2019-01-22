import React, { Component } from 'react'
import Navbar from 'react-bulma-components/lib/components/navbar'
import Link from 'react-router-dom'

export default class Header extends Component {
  state = {
    open: false
  }

  render() {
    const { open } = this.state
    return (
      <Navbar>
        <Link to="/">
          <Navbar.Brand>Sheet Music Database</Navbar.Brand>
        </Link>
        <Navbar.Burger active={open} />
        <Navbar.Menu active={open} id="nav-menu">
          <Navbar.Container>
            <Link to="/">
              <Navbar.Item>Home</Navbar.Item>
            </Link>
          </Navbar.Container>
        </Navbar.Menu>
      </Navbar>
    )
  }
}

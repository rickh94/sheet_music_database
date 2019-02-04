import React, { Component } from 'react'
import Navbar from 'react-bulma-components/lib/components/navbar'
import Heading from 'react-bulma-components/lib/components/heading'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import './Header.scss'

export class Header extends Component {
  state = {
    open: false
  }

  render() {
    const { open } = this.state
    const { token } = this.props.app
    const menuActive = open ? 'is-active' : ''
    return (
      <Navbar color="primary" textColor="light">
        <Navbar.Brand
          textColor="white"
          renderAs="div"
          paddingless={true}
          marginless={true}
        >
          <Link to="/" className="header--link">
            <Navbar.Item
              renderAs="span"
              paddingless={true}
              marginless={true}
              style={{ height: '70%' }}
            >
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
            className={menuActive}
            paddingless={true}
            marginless={true}
            onClick={() => this.setState({ open: !open })}
          />
        </Navbar.Brand>
        <Navbar.Menu className={menuActive} color="primary">
          <Navbar.Container color="primary" position="end">
            <Link to="/" className="header--link">
              <Navbar.Item renderAs="div" className="nav-item-resp">
                Home
              </Navbar.Item>
            </Link>
            {token ? (
              <React.Fragment>
                <Link to="/account" className="header--link">
                  <Navbar.Item renderAs="div" className="nav-item-resp">
                    Account
                  </Navbar.Item>
                </Link>
                <Link to="/logout" className="header--link">
                  <Navbar.Item renderAs="div" className="nav-item-resp">
                    Logout
                  </Navbar.Item>
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Link to="/register" className="header--link">
                  <Navbar.Item renderAs="div" className="nav-item-resp">
                    Register
                  </Navbar.Item>
                </Link>
                <Link to="/login" className="header--link">
                  <Navbar.Item renderAs="div" className="nav-item-resp">
                    Login
                  </Navbar.Item>
                </Link>
              </React.Fragment>
            )}
          </Navbar.Container>
        </Navbar.Menu>
      </Navbar>
    )
  }
}

const mapStateToProps = state => {
  return {
    app: state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

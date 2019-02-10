import React, { Component } from 'react'
import Navbar from 'react-bulma-components/lib/components/navbar'
import Heading from 'react-bulma-components/lib/components/heading'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import './Header.scss'

export class Header extends Component {
  state = {
    open: false
  }

  static propTypes = {
    account: PropTypes.object.isRequired
  }

  render() {
    const { open } = this.state
    const { token } = this.props.account
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
            <HeaderLink to="/">Home</HeaderLink>
            <HeaderLink to="/tags">Tags</HeaderLink>
            {token ? (
              <React.Fragment>
                <HeaderLink to="/profile">Profile</HeaderLink>
                <HeaderLink to="/logout">Logout</HeaderLink>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <HeaderLink to="/register">Register</HeaderLink>
                <HeaderLink to="/login">Login</HeaderLink>
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
    account: state.account
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export function HeaderLink(props) {
  return (
    <Link to={props.to} className="header--link">
      <Navbar.Item renderAs="div" className="nav-item-resp">
        {props.children}
      </Navbar.Item>
    </Link>
  )
}

HeaderLink.propTypes = {
  children: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
}

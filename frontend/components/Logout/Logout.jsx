import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Container from 'react-bulma-components/lib/components/container'
import Card from 'react-bulma-components/lib/components/card'
import Button from 'react-bulma-components/lib/components/button'
import Notification from 'react-bulma-components/lib/components/notification/notification'
import Box from 'react-bulma-components/lib/components/box'
import Heading from 'react-bulma-components/lib/components/heading'
import { withAlert } from 'react-alert'

import Header from '../Header'
import { account } from '../../actions'
import alertText from '../../middleware/alertText'

export class Logout extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired
  }

  state = { errors: null }

  componentDidMount() {
    if (!this.props.account.token) {
      this.props.alert.show(alertText('Not Logged In'), { type: 'error' })
      this.props.history.goBack()
    }
  }

  async onLogoutClicked() {
    const success = await this.props.logout(this.props.account.token)
    this.handleLogout(success)
  }

  async onLogoutAllClicked() {
    const success = await this.props.logout(this.props.account.token, true)
    this.handleLogout(success, true)
  }

  handleLogout(success, all = false, errors = null) {
    const allText = all ? ' All' : ''
    if (success) {
      this.props.alert.show(alertText(`Logout${allText} Successful`), {
        type: 'success'
      })
      this.props.history.push('/')
    } else {
      this.props.alert.show(alertText(`Logout${allText} Failed`), { type: 'error' })
      this.setState({ errors })
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Box className="margin-default">
            {this.state.errors && (
              <Notification color="danger">{this.state.errors}</Notification>
            )}
            <Heading size={3} className="absolutely-no-margin">
              Logout
            </Heading>
            <br />
            <p>Are you sure you want to logout?</p>
            <Button
              onClick={() => this.onLogoutClicked()}
              style={{ marginRight: '0.5rem' }}
            >
              Logout
            </Button>
            <Button onClick={() => this.props.history.goBack()}>Cancel</Button>
            <br />
            <p>
              You can also log out of all devices (this operation cannot be reversed)
            </p>
            <Button
              color="danger"
              onClick={() => this.onLogoutAllClicked()}
            >
              Logout All
            </Button>
          </Box>
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    account: state.account
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: (token, all) => {
      return dispatch(account.logout(token, all))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Logout))

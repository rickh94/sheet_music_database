import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Container from 'react-bulma-components/lib/components/container'
import Card from 'react-bulma-components/lib/components/card'
import Button from 'react-bulma-components/lib/components/button'
import Notification from 'react-bulma-components/lib/components/notification/notification'
import { withAlert } from 'react-alert'

import Header from '../Header'
import { app } from '../../actions'
import alertText from '../../middleware/alertText'

export class Logout extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired
  }

  state = { errors: null }

  componentDidMount() {
    if (!this.props.app.token) {
      this.props.alert.show(alertText('Not Logged In'), { type: 'error' })
      this.props.history.goBack()
    }
  }

  async onLogoutClicked() {
    const success = await this.props.logout(this.props.app.token)
    this.handleLogout(success)
  }

  async onLogoutAllClicked() {
    const success = await this.props.logout(this.props.app.token, true)
    this.handleLogout(success, true)
  }

  handleLogout(success, all = false, errors = null) {
    const allText = all ? ' All' : ''
    if (success) {
      this.props.alert.show(alertText(`Logout${allText} Successful`), {
        type: 'success'
      })
      this.props.history.goBack()
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
          <Card>
            {this.state.errors && (
              <Notification color="danger">{this.state.errors}</Notification>
            )}
            <Card.Header>
              <Card.Header.Title>Logout</Card.Header.Title>
            </Card.Header>
            <Card.Content>
              Are you sure you want to logout?
              <Button onClick={() => this.onLogoutClicked()}>Logout</Button>
              <Button onClick={() => this.props.history.goBack()}>Cancel</Button>
              <br />
              You can also log out of all devices (this operation cannot be reversed)
              <Button color={'danger'} onClick={() => this.onLogoutAllClicked()}>
                Logout All
              </Button>
            </Card.Content>
          </Card>
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    app: state.app
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: (token, all) => {
      return dispatch(app.logout(token, all))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Logout))

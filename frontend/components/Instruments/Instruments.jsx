import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withAlert } from 'react-alert'

import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Level from 'react-bulma-components/lib/components/level'
import Heading from 'react-bulma-components/lib/components/heading'
import Modal from 'react-bulma-components/lib/components/modal'
import Button from 'react-bulma-components/lib/components/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Header from '../Header'
import ListItem from '../ListItem'
import { instruments } from '../../actions'
import { getDataOrLogIn } from '../../helpers'
import alertText from '../../middleware/alertText'
import TextFieldWithErrors from '../TextFieldWithErrors'

export class Instruments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {},
      createMode: false,
      newInstrumentName: ''
    }
  }

  static propTypes = {
    token: PropTypes.string,
    history: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    instruments: PropTypes.object.isRequired,
    getInstruments: PropTypes.func.isRequired,
    createInstrument: PropTypes.func.isRequired,
    updateInstrument: PropTypes.func.isRequired,
    deleteInstrument: PropTypes.func.isRequired
  }

  componentDidMount() {
    getDataOrLogIn(
      this.props.token,
      this.props.alert,
      this.props.history,
      this.props.getInstruments,
      'Instruments'
    )
  }

  handleSubmit = async e => {
    e.preventDefault()
    if (!this.state.newInstrumentName) {
      this.setState({ errors: { name: 'Instrument name is required' } })
      return
    }

    this.setState({ errors: {} })
    const success = await this.props.createInstrument(
      this.props.token,
      this.state.newInstrumentName
    )
    if (success) {
      this.setState({ newInstrumentName: '', createMode: false })
      this.props.alert.show(alertText('Instrument Created'))
    } else {
      this.setState({ errors: { ...this.props.instruments.errors } })
      this.props.alert.show(alertText('Instrument Creation Failed'), { type: 'error' })
    }
  }

  render() {
    const instrumentList = this.props.instruments.list
    const { newInstrumentName } = this.state
    const { token } = this.props
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Box className="margin-default">
            <Level>
              <Level.Side align="left">
                <Level.Item>
                  <Heading size={3} className="absolutely-no-margin">
                    Instruments
                  </Heading>
                </Level.Item>
              </Level.Side>
              <Level.Side align="right">
                <Level.Item>
                  <a
                    style={{ verticalAlign: 'top' }}
                    id="activate-create"
                    className="edit-link"
                    onClick={() => this.setState({ createMode: true })}
                  >
                    <FontAwesomeIcon icon="plus" style={{ paddingRight: '0.2rem' }} />{' '}
                    Create
                  </a>
                </Level.Item>
              </Level.Side>
            </Level>
            {instrumentList.map(instrument => (
              <ListItem
                item={instrument}
                key={instrument.id}
                saveCallback={(_, name) =>
                  this.props.updateInstrument(token, instrument.id, name)
                }
                deleteCallback={id => this.props.deleteInstrument(token, id)}
                errors={this.state.errors[instrument.id]}
              />
            ))}
          </Box>
        </Container>
        <Modal
          show={this.state.createMode}
          onClose={() => this.setState({ createMode: false })}
          closeOnBlur
        >
          <Modal.Content>
            <Box>
              <Heading size={4}>New Instrument</Heading>
              <TextFieldWithErrors
                type="text"
                value={newInstrumentName}
                onChange={e => this.setState({ newInstrumentName: e.target.value })}
                placeholder="Name"
                className="form-padding"
              />
              <Button color="primary" onClick={this.handleSubmit}>
                Save
              </Button>
              <Button
                color="danger"
                onClick={() =>
                  this.setState({ createMode: false, newInstrumentName: '' })
                }
              >
                Cancel
              </Button>
            </Box>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.account.token,
    instruments: state.instruments
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getInstruments: token => {
      return dispatch(instruments.getInstruments(token))
    },
    createInstrument: (token, name) => {
      return dispatch(instruments.createInstrument(token, name))
    },
    updateInstrument: (token, id, name) => {
      return dispatch(instruments.updateInstrument(token, id, name))
    },
    deleteInstrument: (token, id) => {
      return dispatch(instruments.deleteInstrument(token, id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Instruments))

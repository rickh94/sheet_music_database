import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withAlert } from 'react-alert'

import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Level from 'react-bulma-components/lib/components/level'
import Heading from 'react-bulma-components/lib/components/heading'
import { Label } from 'react-bulma-components/lib/components/form'
import Modal from 'react-bulma-components/lib/components/modal'

import 'react-datepicker/dist/react-datepicker.css'

import Header from '../Header'
import { composers } from '../../actions'
import { getDataOrLogIn } from '../../helpers'

import './Composers.scss'
import ComposerForm from '../ComposerForm'
import ItalicLink from '../ItalicLink/ItalicLink'

const blankComposer = {
  name: null,
  born: null,
  died: null,
  is_alive: null
}

export class Composers extends Component {
  static propTypes = {
    composers: PropTypes.object.isRequired,
    getComposers: PropTypes.func.isRequired,
    createComposer: PropTypes.func.isRequired,
    updateComposer: PropTypes.func.isRequired,
    alert: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  state = {
    formOpen: false,
    errors: {},
    editID: null
  }

  componentDidMount() {
    getDataOrLogIn(
      this.props.token,
      this.props.alert,
      this.props.history,
      this.props.getComposers,
      'Composers'
    )
  }

  createOrUpdate = (id, fields) => {
    let composer = {}
    Object.entries(fields).forEach(entry => {
      const [key, val] = entry
      if (val) {
        composer[key] = val
      }
    })
    let success
    if (id) {
      success = this.props.updateComposer(this.props.token, id, composer)
    } else {
      if (!Object.keys(composer).includes('name')) {
        this.setState({ errors: { name: 'Name is required' } })
        return
      }
      if (!Object.keys(composer).includes('era')) {
        this.setState({ errors: { name: 'Era is required' } })
        return
      }
      success = this.props.createComposer(this.props.token, composer)
    }
    if (success) {
      this.setState({ formOpen: false, editID: null })
    } else {
      this.setState({ errors: { ...this.props.composers.errors } })
    }
  }

  render() {
    const composerList = this.props.composers.list
    if (this.props.token) {
      return (
        <React.Fragment>
          <Header />
          <Container>
            <Box>
              <Level>
                <Heading size={3} className="absolutely-no-margin level-left">
                  Composers
                </Heading>
                <a
                  onClick={() => this.setState({ formOpen: true })}
                  className="level-right edit-link"
                >
                  Create
                </a>
              </Level>
              <br />
              {composerList.map(composer => (
                <ComposerItem
                  key={composer.id}
                  composer={composer}
                  onDelete={() => {}}
                />
              ))}
            </Box>
          </Container>
          <Modal
            show={this.state.formOpen}
            onClose={() => this.setState({ formOpen: false })}
            closeOnBlur
          >
            <Modal.Content>
              <Box>
                <ComposerForm
                  errors={this.state.errors}
                  onSubmit={this.createOrUpdate}
                  onCancel={() => this.setState({ formOpen: false })}
                />
              </Box>
            </Modal.Content>
          </Modal>
        </React.Fragment>
      )
    } else {
      return <div />
    }
  }
}

const mapStateToProps = state => {
  return {
    token: state.account.token,
    composers: state.composers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getComposers: token => {
      return dispatch(composers.getComposers(token))
    },
    createComposer: (token, composer) => {
      return dispatch(composers.createComposer(token, composer))
    },
    updateComposer: (token, id, updated) => {
      return dispatch(composers.updateComposer(token, id, updated))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Composers))

export function ComposerItem(props) {
  let dates = ''
  const born = props.composer.born ? props.composer.born.split('-')[0] : ''
  const died = props.composer.died ? props.composer.died.split('-')[0] : ''
  if (props.composer.born || props.composer.died) {
    dates = `(${born}-${died})`
  }
  return (
    <Level>
      <Link to={`/composer/${props.composer.id}`} className="level-item level-left">
        {props.composer.name} {dates}
      </Link>
      <div className="level-right">
        <ItalicLink onClick={() => props.onDelete(props.composer.id)}>
          delete
        </ItalicLink>
      </div>
    </Level>
  )
}

ComposerItem.propTypes = {
  composer: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withAlert } from 'react-alert'

import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Level from 'react-bulma-components/lib/components/level'
import Heading from 'react-bulma-components/lib/components/heading'
import DatePicker from 'react-datepicker'
import { Field, Label, Control } from 'react-bulma-components/lib/components/form'
import Button from 'react-bulma-components/lib/components/button'
import Modal from 'react-bulma-components/lib/components/modal'

import 'react-datepicker/dist/react-datepicker.css'

import Header from '../Header'
import { composers } from '../../actions'
import { getDataOrLogIn } from '../../helpers'
import TextFieldWithErrors from '../TextFieldWithErrors'
import FieldWithErrors from '../FieldWithErrors/FieldWithErrors'

import './Composers.scss'

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
              <ComposerItem key={composer.id} composer={composer} />
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
      return dispatch(composer.updateComposer(token, id, updated))
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
      <div className="level-right" />
    </Level>
  )
}

ComposerItem.propTypes = {
  composer: PropTypes.object.isRequired
}

export class ComposerForm extends Component {
  static propTypes = {
    errors: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    id: PropTypes.number
  }

  state = {
    name: null,
    era: null,
    shortName: null,
    born: null,
    died: null
  }

  render() {
    const { errors, id } = this.props
    const { name, era, shortName, born, died } = this.state
    return (
      <form>
        <Heading className="absolutely-no-margin little-padding-bottom" size={3}>
          {id ? 'Edit Composer' : 'Create Composer'}
        </Heading>
        <TextFieldWithErrors
          type="text"
          label="Name"
          placeholder="Name..."
          onChange={e => this.setState({ name: e.target.value })}
          error={errors.name}
          value={name || ''}
        />
        <TextFieldWithErrors
          type="text"
          label="Era"
          placeholder="Era..."
          onChange={e => this.setState({ era: e.target.value })}
          error={errors.era}
          value={era || ''}
        />
        <TextFieldWithErrors
          type="text"
          label="Shortened Name"
          placeholder="Short Name"
          onChange={e => this.setState({ shortName: e.target.value })}
          error={errors.short_name}
          value={shortName || ''}
        />
        <FieldWithErrors label="Birth Date" error={errors.born}>
          <DatePicker
            selected={born}
            onChange={date => this.setState({ died: born })}
          />
        </FieldWithErrors>
        <FieldWithErrors label="Death Date" error={errors.died}>
          <DatePicker
            selected={died}
            onChange={date => this.setState({ died: date })}
          />
        </FieldWithErrors>
        <Field type="group">
          <Control>
            <Button
              type="primary"
              color="primary"
              onClick={e => {
                e.preventDefault()
                this.props.onSubmit(id, { name, era, shortName, born, died })
              }}
            >
              Submit
            </Button>
            <Button onClick={this.props.onCancel} color="danger">
              Cancel
            </Button>
          </Control>
        </Field>
      </form>
    )
  }
}

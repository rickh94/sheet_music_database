import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withAlert } from 'react-alert'
import { connect } from 'react-redux'

import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Level from 'react-bulma-components/lib/components/level'
import Heading from 'react-bulma-components/lib/components/heading'

import { composers } from '../../actions'
import { getDataOrLogIn, formatDateForBackend } from '../../helpers'
import Header from '../Header'
import FieldDisplay from '../FieldDisplay'

export class Composer extends Component {
  static propTypes = {
    composers: PropTypes.object.isRequired,
    getComposer: PropTypes.func.isRequired,
    updateComposer: PropTypes.func.isRequired,
    alert: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  state = {
    errors: {}
  }

  componentDidMount() {
    getDataOrLogIn(
      this.props.token,
      this.props.alert,
      this.props.history,
      this.props.getComposer,
      'Composer',
      [this.props.match.params.id]
    )
  }

  updateField = async (fieldName, newValue) => {
    const { id } = this.props.match.params
    const updated = { [fieldName]: newValue }
    if (fieldName === 'born' || fieldName === 'died') {
      updated[fieldName] = formatDateForBackend(newValue)

    }
    const success = await this.props.updateComposer(this.props.token, id, updated)
    if (!success) {
      this.setState({ errors: this.props.composers.errors  })
      console.log(this.state.errors)
    }
  }

  render() {
    const { name, born, died, era, short_name } = this.props.composers.composer
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Box>
            <Level>
              <Heading size={3} className="absolutely-no-margin level-left">
                <FieldDisplay
                  value={name || ''}
                  saveCallback={this.updateField}
                  backendFieldName="name"
                  errors={this.state.errors.name}
                />
              </Heading>
            </Level>
            <FieldDisplay
              value={era || ''}
              saveCallback={this.updateField}
              backendFieldName="era"
              label="Era"
              errors={this.state.errors.era}
            />
            <FieldDisplay
              value={short_name || ''}
              saveCallback={this.updateField}
              backendFieldName="short_name"
              label="Short Name"
              errors={this.state.errors.short_name}
            />
            <FieldDisplay
              value={born || null}
              saveCallback={this.updateField}
              backendFieldName="born"
              label="Born"
              errors={this.state.errors.born}
              type="date"
            />
            <FieldDisplay
              value={died || null}
              saveCallback={this.updateField}
              backendFieldName="died"
              label="Died"
              errors={this.state.errors.died}
              type="date"
            />
          </Box>
        </Container>
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
    updateComposer: (token, id, updated) => {
      return dispatch(composers.updateSingleComposer(token, id, updated))
    },
    getComposer: (token, id) => {
      return dispatch(composers.getComposer(token, id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Composer))

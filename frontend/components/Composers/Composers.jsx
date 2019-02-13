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

import 'react-datepicker/dist/react-datepicker.css'

import Header from '../Header'
import { composers } from '../../actions'
import { getDataOrLogIn } from '../../helpers'
import TextFieldWithErrors from '../TextFieldWithErrors'

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
    alert: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
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

  render() {
    const composerList = this.props.composers.list
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Box>
            <Heading size={3} className="absolutely-no-margin">
              Composers
            </Heading>
            <br />
            {composerList.map(composer => (
              <ComposerItem key={composer.id} composer={composer} />
            ))}
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
    getComposers: token => {
      return dispatch(composers.getComposers(token))
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
    errors: PropTypes.object.isRequired
  }

  state = {
    name: null,
    era: null,
    shortName: null,
    born: null, 
    died: null
  }

  render() {
    const { errors } = this.props
    const { name, era, shortName, born, died} = this.state
    return (
      <form>
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
        Birth Date
        <DatePicker selected={born} onChange={date => this.setState({ born: date })} />
        Death Date
        <DatePicker selected={died} onChange={date => this.setState({ died: date })} />
      </form>
    )
  }
}

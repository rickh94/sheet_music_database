import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { withAlert } from 'react-alert'

import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Level from 'react-bulma-components/lib/components/level'
import Heading from 'react-bulma-components/lib/components/heading'

import Header from '../Header'
import { composers } from '../../actions'
import { getDataOrLogIn } from '../../helpers'

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

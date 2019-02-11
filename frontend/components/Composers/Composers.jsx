import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Header from '../Header'
import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Level from 'react-bulma-components/lib/components/level/level'

export class Composers extends Component {
  static propTypes = {
    composers: PropTypes.object.isRequired
  }

  render() {
    const composerList = this.props.composers.list
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Box>
            {composerList.map(composer => (
              <ComposerItem key={composer.id} composer={composer} />
            ))}
          </Box>
        </Container>
      </React.Fragment>
    )
  }
}

export default Composers

export function ComposerItem(props) {
  let dates = ''
  const born = props.composer.born ? props.composer.born : ''
  const died = props.composer.died ? props.composer.died : ''
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

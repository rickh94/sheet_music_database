import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Header from '../Header'
import Container from 'react-bulma-components/lib/components/container'
import Box from 'react-bulma-components/lib/components/box'
import Level from 'react-bulma-components/lib/components/level'
import Heading from 'react-bulma-components/lib/components/heading'
import ListItem from '../ListItem'

export class Instruments extends Component {
  state = {
    errors: {}
  }

  static propTypes = {
    token: PropTypes.string,
    history: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    instruments: PropTypes.object.isRequired
  }

  render() {
    const instrumentList = this.props.instruments.list
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Box className="margin-default">
            <Level>
              <Heading size={3} className="absolutely-no-margin level-item level-left">
                Instruments
              </Heading>
            </Level>
            {instrumentList.map(instrument => (
              <ListItem
                item={instrument}
                key={instrument.id}
                saveCallback={() => {}}
                errors={this.state.errors[instrument.id]}
              />
            ))}
          </Box>
        </Container>
      </React.Fragment>
    )
  }
}

export default Instruments

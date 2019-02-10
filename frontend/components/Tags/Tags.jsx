import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withAlert } from 'react-alert'
import { Link } from 'react-router-dom'

import Container from 'react-bulma-components/lib/components/container/container'
import Card from 'react-bulma-components/lib/components/card/card'
import Heading from 'react-bulma-components/lib/components/heading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Level from 'react-bulma-components/lib/components/level'

import Header from '../Header'
import FieldDisplay from '../FieldDisplay'
import { tags } from '../../actions'
import alertText, { messages } from '../../middleware/alertText'

export class Tags extends Component {
  state = {
    errors: {}
    // errors are saved as [id]: value
  }

  static propTypes = {
    token: PropTypes.string,
    history: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    tags: PropTypes.object.isRequired,
    getTags: PropTypes.func.isRequired
  }

  componentDidMount() {
    if (!this.props.token) {
      this.props.alert.show(messages.notLoggedIn, { type: 'error' })
      this.props.history.push('/login')
    } else {
      const success = this.props.getTags(this.props.token)
      console.log(success)
      if (!success) {
        this.props.alert.show(...messages.couldNotGet('Tags'))
      }
    }
  }

  render() {
    const tagList = this.props.tags.list
    return (
      <React.Fragment>
        <Header />
        <Container>
          <Card className="margin-default">
            <Card.Content>
              <Heading size={3}>Tags</Heading>
              <ul>
                {tagList.map(tag => (
                  <TagItem
                    tag={tag}
                    key={tag.id}
                    saveCallback={() => {}}
                    deleteCallback={() => {}}
                    errors={this.state.errors[tag.id]}
                  />
                ))}
              </ul>
            </Card.Content>
          </Card>
        </Container>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.account.token,
    tags: state.tags
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTags: token => {
      return dispatch(tags.getTags(token))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert(Tags))

export function TagItem(props) {
  return (
    <Level>
      <FieldDisplay
        value={props.tag.name}
        saveCallback={props.saveCallback}
        backendFieldName=""
        errors={props.error}
        linkTo={`/tag/${props.tag.id}`}
      />
      <div className="links">
        <a
          onClick={e => {
            e.preventDefault()
            props.deleteCallback(props.tag.id)
          }}
          className="edit-link"
        >
          delete
        </a>
      </div>
    </Level>
  )
}

TagItem.propTypes = {
  tag: PropTypes.object.isRequired,
  saveCallback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired,
  errors: PropTypes.string
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Header from '../Header'
import Container from 'react-bulma-components/lib/components/container/container'
import Card from 'react-bulma-components/lib/components/card/card'
import Heading from 'react-bulma-components/lib/components/heading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Tags extends Component {
  state = {
    tags: {
      list: []
    }
  }

  static propTypes = {}

  render() {
    const tagList = this.state.tags.list
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
                    editCallback={() => {}}
                    deleteCallback={() => {}}
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

export function TagItem(props) {
  return (
    <li>
      <Link to={`/tag/${props.tag.id}`}>{props.tag.name}</Link>
      <div className="links">
        <a
          onClick={e => {
            e.preventDefault()
            props.editCallback(props.tag.id)
          }}
        >
          <FontAwesomeIcon icon="pen" />
          edit
        </a>
        <a
          onClick={e => {
            e.preventDefault()
            props.deleteCallback(props.tag.id)
          }}
        >
          <FontAwesomeIcon icon="trash" />
          delete
        </a>
      </div>
    </li>
  )
}

TagItem.propTypes = {
  tag: PropTypes.object.isRequired,
  editCallback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired
}

export default Tags

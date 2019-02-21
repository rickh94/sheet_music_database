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
import Modal from 'react-bulma-components/lib/components/modal'
import Button from 'react-bulma-components/lib/components/button'
import Box from 'react-bulma-components/lib/components/box'

import Header from '../Header'
import FieldDisplay from '../FieldDisplay'
import { tags } from '../../actions'
import TextFieldWithErrors from '../TextFieldWithErrors'
import alertText, { messages } from '../../middleware/alertText'
import { getDataOrLogIn } from '../../helpers'

import './Tags.scss'

export class Tags extends Component {
  state = {
    // errors are saved as [id]: value
    errors: {},
    newTagName: '',
    createMode: false
  }

  static propTypes = {
    token: PropTypes.string,
    history: PropTypes.object.isRequired,
    alert: PropTypes.object.isRequired,
    tags: PropTypes.object.isRequired,
    getTags: PropTypes.func.isRequired,
    createTag: PropTypes.func.isRequired,
    updateTag: PropTypes.func.isRequired,
    deleteTag: PropTypes.func.isRequired
  }

  componentDidMount() {
    getDataOrLogIn(
      this.props.token,
      this.props.alert,
      this.props.history,
      this.props.getTags,
      'Tags'
    )
  }

  render() {
    const tagList = this.props.tags.list
    const { token } = this.props
    const { newTagName } = this.state
    if (token) {
      return (
        <React.Fragment>
          <Header />
          <Container>
            <Card className="margin-default">
              <Card.Content>
                <Level>
                  <Heading
                    size={3}
                    className="absolutely-no-margin level-item level-left"
                  >
                    Tags
                  </Heading>
                  <a
                    style={{ verticalAlign: 'top' }}
                    id="activate-create"
                    className="level-item level-right edit-link"
                    onClick={() => this.setState({ createMode: true })}
                  >
                    <FontAwesomeIcon icon="plus" style={{ paddingRight: '0.2rem' }} />{' '}
                    New
                  </a>
                </Level>
                <div>
                  {tagList.map(tag => (
                    <TagItem
                      tag={tag}
                      key={tag.id}
                      saveCallback={(_, name) =>
                        this.props.updateTag(token, tag.id, name)
                      }
                      deleteCallback={id => this.props.deleteTag(token, id)}
                      errors={this.state.errors[tag.id]}
                    />
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Container>
          <Modal
            show={this.state.createMode}
            onClose={() => this.setState({ createMode: false })}
            closeOnBlur
          >
            <Modal.Content>
              <Box>
                <Heading size={4}>New Tag</Heading>
                <TextFieldWithErrors
                  type="text"
                  value={newTagName}
                  onChange={e => this.setState({ newTagName: e.target.value })}
                  placeholder="Name"
                  className="form-padding"
                />
                <Button
                  color="primary"
                  onClick={() => {
                    this.props.createTag(this.props.token, newTagName)
                    this.setState({ createMode: false, newTagName: '' })
                  }}
                >
                  Save
                </Button>
                <Button
                  color="danger"
                  onClick={() => this.setState({ createMode: false, newTagName: '' })}
                >
                  Cancel
                </Button>
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
    tags: state.tags
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTags: token => {
      return dispatch(tags.getTags(token))
    },
    createTag: (token, name) => {
      return dispatch(tags.createTag(token, name))
    },
    updateTag: (token, id, name) => {
      return dispatch(tags.updateTag(token, id, name))
    },
    deleteTag: (token, id) => {
      return dispatch(tags.deleteTag(token, id))
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

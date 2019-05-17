import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withAlert } from 'react-alert'
import { Link } from 'react-router-dom'

import Container from 'react-bulma-components/lib/components/container/container'
import Heading from 'react-bulma-components/lib/components/heading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Level from 'react-bulma-components/lib/components/level'
import Modal from 'react-bulma-components/lib/components/modal'
import Button from 'react-bulma-components/lib/components/button'
import Box from 'react-bulma-components/lib/components/box'

import Header from '../Header'
import FieldDisplay from '../FieldDisplay'
import ListItem from '../ListItem'
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

  handleSubmit = async e => {
    e.preventDefault()
    if (!this.state.newTagName) {
      this.setState({ errors: { name: 'Tag name is required' } })
      return
    }

    this.setState({ errors: {} })
    const success = await this.props.createTag(this.props.token, this.state.newTagName)
    if (success) {
      this.setState({ newTagName: '', createMode: false })
      this.props.alert.show(alertText('Tag Created'))
    } else {
      this.setState({ errors: { ...this.props.tags.errors } })
      this.props.alert.show(alertText('Tag Creation Failed'), { type: 'error' })
    }
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
            <Box className="margin-default">
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
                  Create
                </a>
              </Level>
              <div>
                {tagList.map(tag => (
                  <ListItem
                    item={tag}
                    key={tag.id}
                    saveCallback={(_, name) => {
                      this.props.updateTag(token, tag.id, name)
                    }}
                    deleteCallback={id => this.props.deleteTag(token, id)}
                    errors={this.state.errors[tag.id]}
                  />
                ))}
              </div>
            </Box>
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
                  errors={this.state.errors.name}
                />
                <Button
                  color="primary"
                  onClick={this.handleSubmit}
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

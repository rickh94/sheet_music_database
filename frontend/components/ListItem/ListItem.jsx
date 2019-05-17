import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Level from 'react-bulma-components/lib/components/level'
import Modal from 'react-bulma-components/lib/components/modal'
import Box from 'react-bulma-components/lib/components/box'
import Heading from 'react-bulma-components/lib/components/heading/heading'
import Button from 'react-bulma-components/lib/components/button'

import FieldDisplay from '../FieldDisplay'

function ListItem(props) {
  const [modalIsOpen, openModal] = useState(false)
  return (
    <React.Fragment>
      <Level>
        <Level.Side align="left">
          <Level.Item>
            <FieldDisplay
              value={props.item.name}
              saveCallback={props.saveCallback}
              backendFieldName=""
              errors={props.errors}
              linkTo={`/${props.link}/${props.item.id}`}
            />
          </Level.Item>
        </Level.Side>
        {props.deleteCallback && (
          <Level.Side align="right" className="absolutely-no-margin">
            <Level.Item>
              <div className="links">
                <a
                  onClick={e => {
                    e.preventDefault()
                    openModal(true)
                    // props.deleteCallback(props.item.id)
                  }}
                  className="edit-link"
                >
                  delete
                </a>
              </div>
            </Level.Item>
          </Level.Side>
        )}
      </Level>
      <Modal show={modalIsOpen} onClose={() => openModal(false)}>
        <Modal.Content>
          <Box>
            <div style={{ margin: '1rem' }}>
              <Heading size={3}>Confirm Delete</Heading>
              <p>Are you sure you want to delete {props.item.name}?</p>
              <Button
                color="danger"
                style={{ marginRight: '0.5rem' }}
                onClick={e => {
                  e.preventDefault()
                  props.deleteCallback(props.item.id)
                  openModal(false)
                }}
              >
                Confirm
              </Button>
              <Button
                onClick={e => {
                  e.preventDefault()
                  openModal(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </Modal.Content>
      </Modal>
    </React.Fragment>
  )
}

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  saveCallback: PropTypes.func,
  deleteCallback: PropTypes.func,
  errors: PropTypes.string,
  link: PropTypes.string
}

export default ListItem

import React from 'react'
import PropTypes from 'prop-types'

import Level from 'react-bulma-components/lib/components/level'

import FieldDisplay from '../FieldDisplay'

function ListItem(props) {
  return (
    <Level>
      <FieldDisplay
        value={props.item.name}
        saveCallback={props.saveCallback}
        backendFieldName=""
        errors={props.errors}
        linkTo={`/${props.link}/${props.item.id}`}
      />
      <div className="links">
        {props.deleteCallback && (
          <a
            onClick={e => {
              e.preventDefault()
              props.deleteCallback(props.item.id)
            }}
            className="edit-link"
          >
            delete
          </a>
        )}
      </div>
    </Level>
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